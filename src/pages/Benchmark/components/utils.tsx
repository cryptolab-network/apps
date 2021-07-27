import { IValidator } from '../../../apis/Validator';
import { IAdvancedSetting, IStakingTableData } from './Staking';
import { eraStatus } from '../../../utils/status/Era';

const formatToTableData = (data: IValidator[]): IStakingTableData[] => {
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
