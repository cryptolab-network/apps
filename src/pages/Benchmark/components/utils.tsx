import { IValidator } from '../../../apis/Validator';
import { IAdvancedSetting, ITableData, IStakingInfo } from './Staking';
import { eraStatus } from '../../../utils/status/Era';
import { isElementAccessExpression } from 'typescript';
import { getCandidateNumber } from '../../../utils/constants/Validator';
import { CryptolabKSMValidators, CryptolabDOTValidators } from '../../../utils/constants/Validator';
import { NetworkNameLowerCase } from '../../../utils/constants/Network';

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

export const lowRiskFilter = (
  data: IValidator[],
  advanced: IAdvancedSetting,
  isSupportUs: boolean,
  networkName: string
): IStakingInfo => {
  console.log('first one:', data[0]);
  let filteredResult = data.filter(
    (validator) => validator.info.unclaimedEras.length < 16 && validator.slashes.length === 0
  );

  let tempTableData = formatToTableData(filteredResult);
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
  let tempApyInfo = {
    sum: 0,
    counter: 0,
  };

  for (let idx = 0; idx < resultData.length; idx++) {
    if (resultData[idx].select) {
      tempApyInfo.sum += resultData[idx].avgAPY;
      tempApyInfo.counter += 1;
    } else {
      break;
    }
  }

  return {
    tableData: resultData,
    calculatedApy: tempApyInfo.counter >= 1 ? tempApyInfo.sum / tempApyInfo.counter : 0,
  };
};
export const highApyFilter = (
  data: IValidator[],
  advanced: IAdvancedSetting,
  isSupportUs: boolean,
  networkName: string
): IStakingInfo => {
  // TODO: update filter, below is draft from lowRiskFilter
  console.log('first one:', data[0]);
  let filteredResult = data.filter((validator) => true);
  let formatedData = formatToTableData(filteredResult);
  return { tableData: [], calculatedApy: 0 };
};
export const decentralFilter = (
  data: IValidator[],
  advanced: IAdvancedSetting,
  isSupportUs: boolean,
  networkName: string
): IStakingInfo => {
  // TODO: update filter, below is draft from lowRiskFilter
  console.log('first one:', data[0]);
  let filteredResult = data.filter((validator) => true);
  let formatedData = formatToTableData(filteredResult);
  return { tableData: [], calculatedApy: 0 };
};
export const oneKvFilter = (
  data: IValidator[],
  advanced: IAdvancedSetting,
  isSupportUs: boolean,
  networkName: string
): IStakingInfo => {
  // TODO: update filter, below is draft from lowRiskFilter
  console.log('first one:', data[0]);
  let filteredResult = data.filter((validator) => true);
  let formatedData = formatToTableData(filteredResult);
  return { tableData: [], calculatedApy: 0 };
};
export const customFilter = (
  data: IValidator[],
  advanced: IAdvancedSetting,
  isSupportUs: boolean,
  networkName: string
): IStakingInfo => {
  // TODO: update filter, below is draft from lowRiskFilter
  console.log('first one:', data[0]);
  let filteredResult = data.filter((validator) => true);
  let formatedData = formatToTableData(filteredResult);
  return { tableData: [], calculatedApy: 0 };
};

export const highApySoring = (tableData: ITableData[]): ITableData[] => {
  return tableData.sort((a, b) => {
    if (a.avgAPY > b.avgAPY) {
      return -1;
    } else if (a.avgAPY < b.avgAPY) {
      return 1;
    } else {
      return 0;
    }
  });
};

export const advancedConditionFilter = (
  filtered: IAdvancedSetting,
  originTableData: IStakingInfo,
  isSupportUs: boolean
): IStakingInfo => {
  console.log('origin table data: ', originTableData);
  let tempTableData = originTableData.tableData.filter((data) => {
    // max commission, already done in api query
    // identity, already done in api query
    // max unclaimed eras
    if (filtered.maxUnclaimedEras && data.unclaimedEras > Number(filtered.maxUnclaimedEras)) {
      return false;
    }
    // prev.slashes
    if (!filtered.previousSlashes && data.hasSlash) {
      return false;
    }
    // is sub identity
    if (!filtered.isSubIdentity && data.isSubIdentity) {
      return false;
    }
    // historycal apy, already done in api query
    // min inclusion
    if (filtered.minInclusion && Number(data.eraInclusion.rate) < Number(filtered.minInclusion)) {
      return false;
    }
    // has telemetry, already done in api query
    // high apy, sorting part (check below)
    // decentralized, selected part
    // oneKv, already done in api query
    return true;
  });

  // high apy, sorting
  if (filtered.highApy) {
    console.log('apy sorting trigger');
    // TODO: maybe we don't sort, we just selected the top rank node instead?
    tempTableData = highApySoring(tempTableData);
  }

  /**
   * Selected part
   */
  // support us
  if (isSupportUs) {
    // select support us
    // TODO: select our node
  }
  if (filtered.decentralized) {
    // TODO: select decentralized node
  } else {
    // TODO: select random node
  }

  return { tableData: [], calculatedApy: 0 };
};
