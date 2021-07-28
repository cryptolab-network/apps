import { IValidator } from '../../../apis/Validator';
import { IAdvancedSetting, ITableData } from './Staking';
import { eraStatus } from '../../../utils/status/Era';
import { isElementAccessExpression } from 'typescript';

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

export const lowRiskFilter = (data: IValidator[], advanced: IAdvancedSetting) => {
  console.log('first one:', data[0]);
  let filteredResult = data.filter(
    (validator) => validator.info.unclaimedEras.length < 16 && validator.slashes.length === 0
  );
  // TODO: add selected
  return formatToTableData(filteredResult);
};
export const highApyFilter = (data: IValidator[], advanced: IAdvancedSetting) => {
  // TODO: update filter, below is draft from lowRiskFilter
  console.log('first one:', data[0]);
  let filteredResult = data.filter(
    (validator) => validator.info.unclaimedEras.length < 16 && validator.slashes.length === 0
  );
  return formatToTableData(filteredResult);
};
export const decentralFilter = (data: IValidator[], advanced: IAdvancedSetting) => {
  // TODO: update filter, below is draft from lowRiskFilter
  console.log('first one:', data[0]);
  let filteredResult = data.filter(
    (validator) => validator.info.unclaimedEras.length < 16 && validator.slashes.length === 0
  );
  return formatToTableData(filteredResult);
};
export const oneKvFilter = (data: IValidator[], advanced: IAdvancedSetting) => {
  // TODO: update filter, below is draft from lowRiskFilter
  console.log('first one:', data[0]);
  let filteredResult = data.filter(
    (validator) => validator.info.unclaimedEras.length < 16 && validator.slashes.length === 0
  );
  return formatToTableData(filteredResult);
};
export const customFilter = (data: IValidator[], advanced: IAdvancedSetting) => {
  // TODO: update filter, below is draft from lowRiskFilter
  console.log('first one:', data[0]);
  let filteredResult = data.filter(
    (validator) => validator.info.unclaimedEras.length < 16 && validator.slashes.length === 0
  );
  return formatToTableData(filteredResult);
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
  originTableData: ITableData[],
  isSupportUs: boolean
): ITableData[] => {
  let tempTableData = originTableData.filter((data) => {
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

  return tempTableData;
};
