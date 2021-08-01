import { IValidator } from '../../../apis/Validator';
import { IAdvancedSetting, ITableData, IStakingInfo } from './Staking';
import { eraStatus } from '../../../utils/status/Era';
import { isElementAccessExpression } from 'typescript';
import { getCandidateNumber } from '../../../utils/constants/Validator';
import { CryptolabKSMValidators, CryptolabDOTValidators } from '../../../utils/constants/Validator';
import { NetworkNameLowerCase } from '../../../utils/constants/Network';
import { domainToASCII } from 'url';

const formatToTableData = (data: IValidator[]): ITableData[] => {
  return data.map((validator) => {
    let activeCount = 0;
    let total = 0;
    let nowActive = validator.stakerPoints[validator.stakerPoints.length - 1].points > 0 ? true : false;
    let eraStatusBar: number[] = [];
    for (let idx = 0; idx < 84; idx++) {
      eraStatusBar.push(eraStatus.inactive);
    }
    for (let idx = 0; idx < validator.stakerPoints.length && idx < 84; idx++) {
      total += 1;
      if (validator.stakerPoints[idx].points > 0) {
        activeCount += 1;
        eraStatusBar[idx] = eraStatus.active;
      }
      if (validator.info.unclaimedEras.includes(validator.stakerPoints[idx].era)) {
        eraStatusBar[idx] = eraStatus.unclaimed;
      }
    }
    return {
      select: false,
      account: validator.id,
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
      isSubIdentity: validator.identity.sub ? true : false,
      identity: {
        parent: validator.identity.parent,
      },
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

export const supportCryptoLabSelect = (
  tableData: ITableData[],
  selectableCount: number,
  networkName: string
): ISelectResult => {
  console.log('selectable count at the begin: ', selectableCount);
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

  console.log('after support us, selectableCount:', selectableCount);

  return { tableData, selectableCount };
};

export const randomSelect = (tableData: ITableData[], selectableCount: number): ISelectResult => {
  let selectableData = tableData.filter((data) => data.select === false);

  for (; selectableCount > 0 && selectableData.length > 0; ) {
    let selectIdx = Math.floor(Math.random() * selectableData.length); // random from 0~ length-1
    let selectedIdx = tableData.findIndex((data) => data.account === selectableData[selectIdx].account);
    tableData[selectedIdx].select = true;
    selectableData.splice(selectIdx, 1);
    selectableCount--;
  }

  console.log('after random select, selectableCount:', selectableCount);

  return { tableData, selectableCount };
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

export const apyCalculation = (tableData: ITableData[]): IStakingInfo => {
  let tempApyInfo = {
    sum: 0,
    counter: 0,
  };
  for (let idx = 0; idx < tableData.length; idx++) {
    if (tableData[idx].select) {
      tempApyInfo.sum += tableData[idx].avgAPY;
      tempApyInfo.counter += 1;
    } else {
      break;
    }
  }

  return {
    tableData: tableData,
    calculatedApy: tempApyInfo.counter >= 1 ? tempApyInfo.sum / tempApyInfo.counter : 0,
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
      data.identity.parent.length === 0
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
  console.log('parent group: ', parentGroup);
  console.log('length before push parent: ', filteredTableData.length);
  console.log('big: ', tableData.map((data) => data.account).join(','));
  Object.keys(parentGroup).forEach((key) => {
    const randomIdx = Math.floor(Math.random() * parentGroup[`${key}`].length);
    let findIdx = tableData.findIndex((data) => data.account === parentGroup[`${key}`][randomIdx]);
    if (findIdx !== -1) {
      // console.log('findIdx: ', findIdx);
      // console.log('find data: ', tableData[findIdx]);
      filteredTableData.push(tableData[findIdx]);
    } else {
      console.error('cannot find the index, this shouldn not happen');
    }
  });
  console.log('length after push parent: ', filteredTableData.length);

  return filteredTableData;
};

export const resetSelected = (tableData: ITableData[]): ITableData[] => {
  return tableData.map((data) => {
    data.select = false;
    return data;
  });
};

/**
 * for strategy selection filter
 */
export const lowRiskStrategy = (
  data: IValidator[],
  isSupportUs: boolean,
  networkName: string
): IStakingInfo => {
  console.log('first one:', data[0]);
  let filteredResult = data.filter(
    (validator) => validator.info.unclaimedEras.length < 16 && validator.slashes.length === 0
  );

  let tempTableData = formatToTableData(filteredResult);
  tempTableData = resetSelected(tempTableData);
  let tempSelectableCount = getCandidateNumber(networkName);

  // if support us
  if (isSupportUs) {
    const { tableData, selectableCount } = supportCryptoLabSelect(
      tempTableData,
      tempSelectableCount,
      networkName
    );
    tempTableData = tableData;
    tempSelectableCount = selectableCount;
  }
  // random select the rest available count
  let { tableData: resultData } = randomSelect(tempTableData, tempSelectableCount);
  // sort the tagged one to the top of the list
  resultData = sortSelectedTableData(resultData);

  return apyCalculation(resultData);
};
export const highApyFilter = (
  data: IValidator[],
  isSupportUs: boolean,
  networkName: string
): IStakingInfo => {
  // TODO: update filter, below is draft from lowRiskStrategy
  console.log('first one:', data[0]);
  let filteredResult = data.filter((validator) => true);
  let formatedData = formatToTableData(filteredResult);
  return { tableData: [], calculatedApy: 0 };
};
export const decentralStrategy = (
  data: IValidator[],
  isSupportUs: boolean,
  networkName: string
): IStakingInfo => {
  // TODO: update filter, below is draft from lowRiskStrategy
  console.log('first one:', data[0]);
  let filteredResult = data.filter((validator) => true);
  let formatedData = formatToTableData(filteredResult);
  return { tableData: [], calculatedApy: 0 };
};
export const oneKvStrategy = (
  data: IValidator[],
  isSupportUs: boolean,
  networkName: string
): IStakingInfo => {
  // TODO: update filter, below is draft from lowRiskStrategy
  console.log('first one:', data[0]);
  let filteredResult = data.filter((validator) => true);
  let formatedData = formatToTableData(filteredResult);
  return { tableData: [], calculatedApy: 0 };
};
export const customStrategy = (
  data: IValidator[],
  isSupportUs: boolean,
  networkName: string
): IStakingInfo => {
  // TODO: update filter, below is draft from lowRiskStrategy
  console.log('first one:', data[0]);
  return apyCalculation(formatToTableData(data));
};

/**
 * for advanaced
 */
export const advancedConditionFilter = (
  filtered: IAdvancedSetting,
  originTableData: IStakingInfo,
  isSupportUs: boolean,
  networkName: string
): IStakingInfo => {
  console.log('origin table data: ', originTableData);
  let tempTableData = resetSelected(originTableData.tableData);
  console.log('after reset selected: ', tempTableData);
  tempTableData = originTableData.tableData.filter((data) => {
    // max commission, already done in api query
    // identity, already done in api query
    // max unclaimed eras
    if (filtered.maxUnclaimedEras && data.unclaimedEras > Number(filtered.maxUnclaimedEras)) {
      console.log('maxUnclaimedEras: ', filtered.maxUnclaimedEras);
      return false;
    }
    // prev.slashes
    if (!filtered.previousSlashes && data.hasSlash) {
      console.log('previousSlashes: ', filtered.previousSlashes);
      return false;
    }
    // is sub identity
    if (!filtered.isSubIdentity && data.isSubIdentity) {
      // console.log('isSubIdentity: ', filtered.isSubIdentity);
      return false;
    }
    // historycal apy, already done in api query
    // min inclusion
    if (filtered.minInclusion && Number(data.eraInclusion.rate) < Number(filtered.minInclusion)) {
      console.log('minInclusion: ', filtered.minInclusion);
      return false;
    }
    // has telemetry, already done in api query
    // high apy, sorting part (check below)
    // decentralized, selected part
    // oneKv, already done in api query
    return true;
  });
  console.log('in advancedConditionFilter, tableData: ', tempTableData);

  /**
   * decentralized filter
   */
  if (filtered.decentralized) {
    tempTableData = decentralizedFilter(tempTableData);
  }

  /**
   * Selected part
   */
  let tempSelectableCount = getCandidateNumber(networkName);

  // if support us
  if (isSupportUs) {
    const { tableData, selectableCount } = supportCryptoLabSelect(
      tempTableData,
      tempSelectableCount,
      networkName
    );
    tempTableData = tableData;
    tempSelectableCount = selectableCount;
  }

  if (filtered.highApy) {
    // select by the order of high apy
    const highApySelectResult = highApySelect(tempTableData, tempSelectableCount);
    tempTableData = highApySelectResult.tableData;
  } else {
    // random select
    const ramdomSelectResult = randomSelect(tempTableData, tempSelectableCount);
    tempTableData = ramdomSelectResult.tableData;
  }

  tempTableData = sortSelectedTableData(tempTableData);

  return apyCalculation(tempTableData);
};
