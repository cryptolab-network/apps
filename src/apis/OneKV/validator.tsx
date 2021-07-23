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
  nominationOrder: number
}

export interface IOneKVInvalidValidator {
  name: string,
  stash: string
  reasons: string[],
}

export interface IOneKVValidators {
  activeEra: number,
  validatorCount: number,
  electedCount: number,
  electionRate: number,
  valid: IOneKVValidator[],
  invalid: IOneKVInvalidValidator[],
  modifiedTime: number
}

export const apiGetAllOneKVValidator = (data: IValidatorRequest, invalid = false): Promise<IOneKVValidators> =>
validatorOneKVAxios.get(`${data.params}`, { params: data.query }).then((res) => {
  if(invalid) {
    // res.data.va
  } else {
    res.data._valid = res.data.valid;
    res.data.valid = res.data._valid.filter(function(v) {
      return v !== undefined && v.valid === true;
    });
    res.data.invalid = res.data._valid.filter(function(v) {
      return (v !== undefined) && (v.valid === false);
    })
    res.data.valid = res.data.valid.sort((a: IOneKVValidator, b: IOneKVValidator) => {
      if(a.aggregate.total > b.aggregate.total) {
        return -1;
      } else if (a.aggregate.total < b.aggregate.total) {
        return 1;
      }
      return 0;
    });
    res.data.valid = res.data.valid.map((v, idx) => {
      v.nominationOrder = idx + 1;
      return v;
    });
    return res.data;
  }
});
