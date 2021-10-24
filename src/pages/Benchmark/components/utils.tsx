import { IValidator } from '../../../apis/Validator';
import { IAdvancedSetting, ITableData, IStakingInfo } from './Staking';
import { eraStatus } from '../../../utils/status/Era';
import { getCandidateNumber } from '../../../utils/constants/Validator';
import { CryptolabKSMValidators, CryptolabDOTValidators } from '../../../utils/constants/Validator';
import { NetworkNameLowerCase } from '../../../utils/constants/Network';
import _ from 'lodash';
import BN from 'bn.js';
import { NetworkConfig } from '../../../utils/constants/Network';

const ROUND = 10;
const KSM_MIN_SELF_STAKE = 50;
const DOT_MIN_SELF_STAKE = 1000;

interface IEraStatusBar {
  era: number[];
  status: number[];
}

export const formatToTableData = (data: IValidator[]): ITableData[] => {
  return data.map((validator) => {
    let activeCount = 0;
    let total = 0;
    let nowActive = validator.stakerPoints[validator.stakerPoints.length - 1].points > 0 ? true : false;
    let eraStatusBar: IEraStatusBar = { era: [], status: [] };
    for (let idx = 0; idx < 84; idx++) {
      eraStatusBar.era.push(validator.stakerPoints[idx].era);
      eraStatusBar.status.push(eraStatus.inactive);
    }
    for (let idx = 0; idx < validator.stakerPoints.length && idx < 84; idx++) {
      total += 1;
      if (validator.stakerPoints[idx].points > 0) {
        activeCount += 1;
        eraStatusBar.status[idx] = eraStatus.active;
      }
      if (validator.info.unclaimedEras.includes(validator.stakerPoints[idx].era)) {
        eraStatusBar.status[idx] = eraStatus.unclaimed;
      }
    }
    return {
      select: false,
      account: validator.id,
      display: validator.identity.display,
      selfStake: validator.info.selfStake,
      eraInclusion: {
        rate: ((activeCount / total) * 100).toFixed(2),
        activeCount: activeCount,
        total: total,
      },
      unclaimedEras: validator.info.unclaimedEras.length,
      avgAPY: validator.averageApy,
      active: nowActive,
      subRows: [
        {
          unclaimedEras: eraStatusBar,
        },
      ],
      commission: validator.info.commission,
      hasSlash: validator.slashes.length > 0 ? true : false,
      isSubIdentity: validator.identity.parent ? true : false,
      identity: {
        parent: validator.identity.parent,
        isVerified: validator.identity.isVerified ? true : false,
      },
      blockNomination: validator.blockNomination,
    };
  });
};

interface ISelectResult {
  tableData: ITableData[];
  selectableCount: number;
}

export const sortSelectedTableData = (
  tableData: ITableData[],
  selectedFirst: boolean = true
): ITableData[] => {
  tableData.sort((a, b) => {
    if (a.select && !b.select) {
      return selectedFirst ? -1 : 1;
    } else if (!a.select && b.select) {
      return selectedFirst ? 1 : -1;
    } else {
      return 0;
    }
  });
  return tableData;
};

enum OrderBy {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const sortHighApy = (tableData: ITableData[], orderBy: OrderBy = OrderBy.DESC): ITableData[] => {
  tableData.sort((a, b) => {
    if (a.avgAPY > b.avgAPY) {
      return orderBy === OrderBy.DESC ? -1 : 1;
    } else if (a.avgAPY < b.avgAPY) {
      return orderBy === OrderBy.DESC ? 1 : -1;
    } else {
      return 0;
    }
  });
  return tableData;
};

export const sortUnSelectedHighApy = (
  tableData: ITableData[],
  orderBy: OrderBy = OrderBy.DESC
): ITableData[] => {
  tableData.sort((a, b) => {
    if (a.select === false && b.select === false) {
      if (a.avgAPY > b.avgAPY) {
        return orderBy === OrderBy.DESC ? -1 : 1;
      } else if (a.avgAPY < b.avgAPY) {
        return orderBy === OrderBy.DESC ? 1 : -1;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  });
  return tableData;
};

export const supportCryptoLabSelect = (
  tableData: ITableData[],
  selectableCount: number,
  networkName: string
): ISelectResult => {
  const cryptoLabNode: string[] =
    networkName.toLowerCase() === NetworkNameLowerCase.KSM
      ? Object.values(CryptolabKSMValidators)
      : Object.values(CryptolabDOTValidators);
  // tag the validator as selected
  for (let idx = 0; idx < tableData.length && selectableCount > 0; idx++) {
    if (cryptoLabNode.includes(tableData[idx].account)) {
      tableData[idx].select = true;
      selectableCount--;
    }
  }

  return { tableData, selectableCount };
};

// ref key stash id select
export const refStashSelect = (
  tableData: ITableData[],
  selectableCount: number,
  stashId: string
): ISelectResult => {
  // tag the validator as selected
  for (let idx = 0; idx < tableData.length && selectableCount > 0; idx++) {
    if (tableData[idx].account === stashId) {
      tableData[idx].select = true;
      selectableCount--;
    }
  }

  return { tableData, selectableCount };
};

export const randomSelect = (tableData: ITableData[], selectableCount: number): ISelectResult => {
  // filter out the selectable and commission <= 20's validators
  const tableDataOrigin = _.cloneDeep(tableData);
  const selectableDataOrigin = tableData.filter((data) => data.select === false && data.commission <= 20);
  const selectableCountOrigin = selectableCount;

  interface ITempScore {
    data: ITableData[];
    score: number;
    count: number;
  }

  let roundScoreInfo: ITempScore[] = [];

  // run ROUND loop, choose the top apy (score) one
  for (let round = 0; round < ROUND; round++) {
    let tempTableData = _.cloneDeep(tableDataOrigin);
    let tempSelectableData = selectableDataOrigin.slice();
    let tempSelectableCount = selectableCountOrigin;
    for (; tempSelectableCount > 0 && tempSelectableData.length > 0; ) {
      let selectIdx = Math.floor(Math.random() * tempSelectableData.length); // random from 0~ length-1
      let selectedIdx = tempTableData.findIndex(
        (data) => data.account === tempSelectableData[selectIdx].account
      );
      tempTableData[selectedIdx].select = true;
      tempSelectableData.splice(selectIdx, 1);
      tempSelectableCount--;
    }
    roundScoreInfo.push({
      data: tempTableData,
      score: apyCalculation(tempTableData).calculatedApy,
      count: tempSelectableCount,
    });
  }

  roundScoreInfo.sort((a, b) => {
    if (a.score > b.score) {
      return -1;
    } else if (a.score < b.score) {
      return 1;
    } else {
      return 0;
    }
  });
  return { tableData: roundScoreInfo[0].data, selectableCount: roundScoreInfo[0].count };
};

export const highApySelect = (tableData: ITableData[], selectableCount: number): ISelectResult => {
  let selectableData = tableData.filter((data) => data.select === false);
  selectableData = sortHighApy(selectableData);

  for (let idx = 0; idx < selectableData.length && selectableCount > 0; idx++) {
    let selectedIdx = tableData.findIndex((data) => data.account === selectableData[idx].account);
    tableData[selectedIdx].select = true;
    selectableData.splice(idx, 1);
    selectableCount--;
  }
  return { tableData, selectableCount };
};

export const prevValidatorsSelect = (
  tableData: ITableData[],
  selectableCount: number,
  prevValidators: string[]
): ISelectResult => {
  if (prevValidators === undefined) {
    prevValidators = [];
  }
  let selectableData = tableData.filter((data) => !data.select);
  for (let idx = 0; idx < selectableData.length && selectableCount > 0; idx++) {
    const isPrevValidator = prevValidators.filter((v) => v === selectableData[idx].account);
    if (isPrevValidator.length === 0) {
      continue;
    }
    let selectedIdx = tableData.findIndex((data) => data.account === selectableData[idx].account);
    tableData[selectedIdx].select = true;
    selectableData.splice(idx, 1);
    selectableCount--;
  }
  return { tableData, selectableCount };
};

export const apyCalculation = (tableData: ITableData[], selectableCount?: number): IStakingInfo => {
  //
  tableData = sortSelectedTableData(tableData);
  tableData = sortUnSelectedHighApy(tableData);
  let tempApyInfo = {
    sum: 0,
    counter: 0,
  };
  for (let idx = 0; idx < tableData.length; idx++) {
    if (tableData[idx].select) {
      tempApyInfo.sum += tableData[idx].avgAPY;
      if (tableData[idx].avgAPY > 0) {
        // we only count the avgAPY that is > 0, otherwise we just selected, but dont't count
        tempApyInfo.counter += 1;
      }
    } else {
      break;
    }
  }

  return {
    tableData: tableData,
    calculatedApy: tempApyInfo.counter >= 1 ? tempApyInfo.sum / tempApyInfo.counter : 0,
    selectableCount: selectableCount,
  };
};

export const decentralizedFilter = (tableData: ITableData[]): ITableData[] => {
  let parentGroup = {};
  let filteredTableData: ITableData[] = [];
  tableData.forEach((data) => {
    // no parent, no group
    if (
      data.identity.parent === null ||
      data.identity.parent === undefined ||
      data.identity.parent.length === 0 ||
      data.select === true // support us has been already selected
    ) {
      filteredTableData.push(data);
    } else {
      if (`${data.identity.parent}` in parentGroup) {
        parentGroup = {
          ...parentGroup,
          [`${data.identity.parent}`]: [...parentGroup[`${data.identity.parent}`], data.account],
        };
      } else {
        parentGroup = {
          ...parentGroup,
          [`${data.identity.parent}`]: [data.account],
        };
      }
    }
  });
  Object.keys(parentGroup).forEach((key) => {
    const randomIdx = Math.floor(Math.random() * parentGroup[`${key}`].length);
    let findIdx = tableData.findIndex((data) => data.account === parentGroup[`${key}`][randomIdx]);
    if (findIdx !== -1) {
      filteredTableData.push(tableData[findIdx]);
    } else {
      console.error('cannot find the index, this shouldn not happen');
    }
  });

  return filteredTableData;
};

export const resetSelected = (tableData: ITableData[]): ITableData[] => {
  return tableData.map((data) => {
    data.select = false;
    return data;
  });
};

export const filterBlockNomination = (tableData: ITableData[]): ITableData[] => {
  return tableData.filter((data) => !data.blockNomination);
};

// format origin data from api, to IStakingInfo format
export const formatToStakingInfo = (data: IValidator[], networkName: string): IStakingInfo => {
  // format the data to fit the frontend table
  let tempTableData = formatToTableData(data);
  // unselected all
  tempTableData = resetSelected(tempTableData);
  // get maximum candidate number base on current network
  let tempSelectableCount = getCandidateNumber(networkName);

  // get the calculation apy of the selected validators
  return apyCalculation(tempTableData, tempSelectableCount);
};

/**
 * for strategy selection filter
 */
export const lowRiskStrategy = (
  data: IStakingInfo,
  isSupportUs: boolean,
  networkName: string,
  prevValidators: string[]
): IStakingInfo => {
  let tempTableData = data.tableData;
  // get maximum candidate number base on current network
  let tempSelectableCount = getCandidateNumber(networkName);
  // unselected all
  tempTableData = resetSelected(tempTableData);
  // filter the validators which block new nomination
  tempTableData = filterBlockNomination(tempTableData);
  // if support us
  if (isSupportUs) {
    // select our validators, decrease the selectable number
    const { tableData, selectableCount } = supportCryptoLabSelect(
      tempTableData,
      tempSelectableCount,
      networkName
    );
    tempTableData = tableData;
    tempSelectableCount = selectableCount;
  }
  // low risk data filtered
  const decimals = new BN(10).pow(new BN(NetworkConfig[networkName].decimals));
  tempTableData = tempTableData.filter((validator) => {
    if (validator.select) {
      return true;
    }
    let minSelfStakeFlag = false;
    if (
      (networkName.toLowerCase() === NetworkNameLowerCase.KSM &&
        new BN(validator.selfStake).gte(new BN(KSM_MIN_SELF_STAKE).mul(decimals))) ||
      (networkName.toLowerCase() === NetworkNameLowerCase.DOT &&
        new BN(validator.selfStake).gte(new BN(DOT_MIN_SELF_STAKE).mul(decimals)))
    ) {
      minSelfStakeFlag = true;
    }
    if (
      minSelfStakeFlag &&
      validator.unclaimedEras < 16 &&
      validator.hasSlash === false &&
      validator.identity.isVerified === true &&
      validator.blockNomination === false
    ) {
      return true;
    }
    return false;
  });

  // select previous selected validators first
  const prevValidatorsSelectResult = prevValidatorsSelect(tempTableData, tempSelectableCount, prevValidators);
  tempTableData = prevValidatorsSelectResult.tableData;
  tempSelectableCount = prevValidatorsSelectResult.selectableCount;

  // random select the rest available count
  let { tableData: resultData } = randomSelect(tempTableData, tempSelectableCount);

  // get the calculation apy of the selected validators
  return apyCalculation(resultData);
};
export const highApyStrategy = (
  data: IStakingInfo,
  isSupportUs: boolean,
  networkName: string,
  prevValidators: string[]
): IStakingInfo => {
  let tempTableData = data.tableData;
  // get maximum candidate number base on current network
  let tempSelectableCount = getCandidateNumber(networkName);
  // unselected all
  tempTableData = resetSelected(tempTableData);
  // filter the validators which block new nomination
  tempTableData = filterBlockNomination(tempTableData);
  // if support us
  if (isSupportUs) {
    // select our validators, decrease the selectable number
    const { tableData, selectableCount } = supportCryptoLabSelect(
      tempTableData,
      tempSelectableCount,
      networkName
    );
    tempTableData = tableData;
    tempSelectableCount = selectableCount;
  }

  // select previous selected validators first
  const prevValidatorsSelectResult = prevValidatorsSelect(tempTableData, tempSelectableCount, prevValidators);
  tempTableData = prevValidatorsSelectResult.tableData;
  tempSelectableCount = prevValidatorsSelectResult.selectableCount;

  // select the high apy validators, decrease the selectable number
  const highApySelectResult = highApySelect(tempTableData, tempSelectableCount);
  tempTableData = highApySelectResult.tableData;

  // get the calculation apy of the selected validators
  return apyCalculation(tempTableData);
};
export const decentralStrategy = (
  data: IStakingInfo,
  isSupportUs: boolean,
  networkName: string,
  prevValidators: string[]
): IStakingInfo => {
  let tempTableData = data.tableData;
  // get maximum candidate number base on current network
  let tempSelectableCount = getCandidateNumber(networkName);
  // unselected all
  tempTableData = resetSelected(tempTableData);
  // filter the validators which block new nomination
  tempTableData = filterBlockNomination(tempTableData);
  if (isSupportUs) {
    // select our validators, decrease the selectable number
    const { tableData, selectableCount } = supportCryptoLabSelect(
      tempTableData,
      tempSelectableCount,
      networkName
    );
    tempTableData = tableData;
    tempSelectableCount = selectableCount;
  }

  // filtered the data, make sure the candidates are all decentralized,
  tempTableData = decentralizedFilter(tempTableData);

  // select previous selected validators first
  const prevValidatorsSelectResult = prevValidatorsSelect(tempTableData, tempSelectableCount, prevValidators);
  tempTableData = prevValidatorsSelectResult.tableData;
  tempSelectableCount = prevValidatorsSelectResult.selectableCount;

  // select the high apy validators, decrease the selectable number
  const highApySelectResult = highApySelect(tempTableData, tempSelectableCount);
  tempTableData = highApySelectResult.tableData;

  // get the calculation apy of the selected validators
  return apyCalculation(tempTableData);
};
export const oneKvStrategy = (
  data: IStakingInfo,
  isSupportUs: boolean,
  networkName: string,
  prevValidators: string[]
): IStakingInfo => {
  let tempTableData = data.tableData;
  // get maximum candidate number base on current network
  let tempSelectableCount = getCandidateNumber(networkName);
  // unselected all
  tempTableData = resetSelected(tempTableData);
  // filter the validators which block new nomination
  tempTableData = filterBlockNomination(tempTableData);
  if (isSupportUs) {
    // select our validators, decrease the selectable number
    const { tableData, selectableCount } = supportCryptoLabSelect(
      tempTableData,
      tempSelectableCount,
      networkName
    );
    tempTableData = tableData;
    tempSelectableCount = selectableCount;
  }

  // select previous selected validators first
  const prevValidatorsSelectResult = prevValidatorsSelect(tempTableData, tempSelectableCount, prevValidators);
  tempTableData = prevValidatorsSelectResult.tableData;
  tempSelectableCount = prevValidatorsSelectResult.selectableCount;

  // random select the rest available count
  const randomSelectResult = randomSelect(tempTableData, tempSelectableCount);
  tempTableData = randomSelectResult.tableData;

  // get the calculation apy of the selected validators
  return apyCalculation(tempTableData);
};
export const customStrategy = (
  data: IValidator[],
  isSupportUs: boolean,
  networkName: string
): IStakingInfo => {
  // for custom strategy, most of the things are doing in the 'advancedConditionFilter' below

  // get the calculation apy of the selected validators
  return apyCalculation(formatToTableData(data));
};

/**
 * for advanaced
 */
export const advancedConditionFilter = (
  filtered: IAdvancedSetting,
  originTableData: IStakingInfo,
  isSupportUs: boolean,
  networkName: string,
  prevValidators: string[],
  refStashId?: string
): IStakingInfo | any => {
  let tempTableData = resetSelected(originTableData.tableData);
  // filter the validators which block new nomination
  tempTableData = filterBlockNomination(tempTableData);
  // get maximum candidate number base on current network
  let tempSelectableCount = getCandidateNumber(networkName);
  // if support us
  if (isSupportUs) {
    // select our validators, decrease the selectable number
    const { tableData, selectableCount } = supportCryptoLabSelect(
      tempTableData,
      tempSelectableCount,
      networkName
    );
    tempTableData = tableData;
    tempSelectableCount = selectableCount;
  }
  const decimals = new BN(10).pow(new BN(NetworkConfig[networkName].decimals));
  // if ref stash id exist
  if (refStashId) {
    const { tableData, selectableCount } = refStashSelect(tempTableData, tempSelectableCount, refStashId);
    tempTableData = tableData;
    tempSelectableCount = selectableCount;
  }

  tempTableData = tempTableData.filter((data) => {
    if (!data.select) {
      // only data hasn't been selected need to be filtered

      // min self stake
      if (filtered.minSelfStake && new BN(data.selfStake).lt(new BN(filtered.minSelfStake).mul(decimals))) {
        return false;
      }

      // max unclaimed eras
      if (filtered.maxUnclaimedEras && data.unclaimedEras > Number(filtered.maxUnclaimedEras)) {
        return false;
      }

      // historycal apy
      if (filtered.historicalApy && Math.floor(data.avgAPY * 100) < Number(filtered.historicalApy)) {
        return false;
      }

      // min inclusion
      if (
        filtered.minInclusion &&
        Math.floor(Number(data.eraInclusion.rate)) < Number(filtered.minInclusion)
      ) {
        return false;
      }

      // identity
      if (filtered.identity && (!data.identity || !data.identity.isVerified)) {
        return false;
      }

      // No prev.slashes
      if (filtered.noPreviousSlashes && data.hasSlash) {
        return false;
      }
      // is sub identity
      if (filtered.isSubIdentity && !data.isSubIdentity) {
        return false;
      }

      // high apy, sorting part (check below)
      // decentralized, selected part
      // oneKv, already done in api query
      // has telemetry (ongoing)
    }

    return true;
  });

  /**
   * decentralized filter
   */
  if (filtered.decentralized) {
    // filtered the data, make sure the candidates are all decentralized
    tempTableData = decentralizedFilter(tempTableData);
  }

  /**
   * Selected part
   */

  // select previous selected validators first
  const prevValidatorsSelectResult = prevValidatorsSelect(tempTableData, tempSelectableCount, prevValidators);
  tempTableData = prevValidatorsSelectResult.tableData;
  tempSelectableCount = prevValidatorsSelectResult.selectableCount;

  if (filtered.highApy) {
    // select the high apy validators, decrease the selectable number
    const highApySelectResult = highApySelect(tempTableData, tempSelectableCount);
    tempTableData = highApySelectResult.tableData;
    tempSelectableCount = highApySelectResult.selectableCount;
  } else {
    // random select the rest available count
    const randomSelectResult = randomSelect(tempTableData, tempSelectableCount);
    tempTableData = randomSelectResult.tableData;
    tempSelectableCount = randomSelectResult.selectableCount;
  }

  return apyCalculation(tempTableData, tempSelectableCount);
};

export enum IStakeAmountValidateType {
  BONDED = 'bonded',
  STAKEAMOUNT = 'stakeAmount',
}
/**
 * stake amount value check
 */
export const stakeAmountValidate = (
  value: number,
  itemName: IStakeAmountValidateType,
  notifyCallback
): boolean => {
  switch (itemName) {
    case 'bonded':
      if (Number(value) <= 0) {
        notifyCallback('bonded value cannot be 0');
        return false;
      }
      break;
    case 'stakeAmount':
      if (Number(value) <= 0) {
        notifyCallback('staking amount cannot be smaller than 0');
        return false;
      }
      break;
  }
  return true;
};
