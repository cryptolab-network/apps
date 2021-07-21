import { nominatorOneKVAxios, validatorOneKVAxios } from '../../instance/Axios';
import { IValidatorRequest } from '../Validator';

export interface Aggregate {
  total: number,
  aggregate: number,
  inclusion: number,
  discovered: number,
  nominated: number,
  rank: number,
  unclaimed: number,
  randomness: number,
}

export interface ValidatorPrefs {
  commission: number,
  blocked: boolean
}

export interface StakingLedger {
  stash: string,
  total: number,
  active: number
}

export interface StakingInfo {
  stakingLedger: StakingLedger,
  stashId: string,
  validatorPrefs: ValidatorPrefs
}

export interface IOneKVValidator {
  rank: number,
  inclusion: number,
  name: string,
  stash: string
  elected: boolean,
  activeNominators: number,
  totalNominators: number,
  nominatedAt: string,
  stakingInfo: StakingInfo,
  aggregate: Aggregate,
  electedBy?: string,
  selfStake: string,
}

export interface IOneKVValidators {
  activeEra: number,
  validatorCount: number,
  electedCount: number,
  electionRate: number,
  valid: IOneKVValidator[]
}

export const apiGetAllOneKVValidator = (data: IValidatorRequest): Promise<IOneKVValidators> =>
validatorOneKVAxios.get(`${data.params}`, { params: data.query }).then((res) => {
  res.data.valid = res.data.valid.sort((a: IOneKVValidator, b: IOneKVValidator) => {
    if(a.aggregate.total > b.aggregate.total) {
      return -1;
    } else if (a.aggregate.total < b.aggregate.total) {
      return 1;
    }
    return 0;
  });
  return res.data;
});
