import { CancelToken } from 'axios';
import { nominatedValidatorsAxios, singleValidatorAxios, validatorAxios } from '../../instance/Axios';

export interface IStatusChange {
  commissionChange: number;
}

export interface IIdentity {
  display: string;
  parent?: string | null;
  sub?: string | null;
  isVerified?: boolean;
}

export interface Balance {
  freeBalance: number;
  lockedBalance: number;
}

export interface INominator {
  address: string;
  balance: Balance;
}

export interface IExposureOthers {
  who: string;
  value: number;
}

export interface IExposure {
  total: number;
  own: number;
  others: IExposureOthers[];
}

export interface IEraInfo {
  nominators: INominator[];
  nominatorCount: number;
  era: number;
  exposure: IExposure;
  commission: number;
  apy: number;
  unclaimedEras: number[];
  total: number;
  selfStake: number;
}

export interface IStakerPoints {
  era: number;
  points: number;
}

export interface ISlash {
  era: number;
  validator: string;
  total: number;
  others: {
    address: string;
    value: number;
  }[];
}

export interface IValidator {
  id: string;
  statusChange: IStatusChange;
  identity: IIdentity;
  stakerPoints: IStakerPoints[];
  info: IEraInfo;
  averageApy: number;
  slashes: ISlash[];
  favorite: boolean;
}

export interface IValidatorHistory {
  id: string;
  statusChange: IStatusChange;
  identity: IIdentity;
  info: IEraInfo[];
  averageApy: number;
}

export interface IValidatorSlashedNominator {
  address: string;
  value: number;
}

export interface IValidatorSlash {
  address: string;
  total: number;
  era: number;
  others: IValidatorSlashedNominator[];
}

export interface IValidatorQuery {
  size?: number;
  page?: number;
  has_telemetry?: boolean;
  apy_min?: number;
  apy_max?: number;
  commission_min?: number;
  commission_max?: number;
  has_verified_identity?: boolean;
}
export interface IValidatorRequest {
  params: string;
  query?: IValidatorQuery;
  cancelToken?: CancelToken;
}
export const apiGetAllValidator = (data: IValidatorRequest): Promise<IValidator[]> =>
  validatorAxios
    .get(`${data.params}`, { cancelToken: data.cancelToken, params: data.query })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
export const apiGetSingleValidator = (data: IValidatorRequest): Promise<IValidatorHistory> =>
  singleValidatorAxios.get(`${data.params}`, { params: data.query }).then((res) => {
    if (res.data.length > 0) {
      return res.data[0];
    } else {
      throw new Error('The stash is not a validaor');
    }
  });
export const apiGetNominatedValidators = (data: IValidatorRequest): Promise<IValidator[]> =>
  nominatedValidatorsAxios.get(`${data.params}`, { params: data.query }).then((res) => {
    return res.data;
  });


export const apiGetValidatorUnclaimedEras = (
  data: IValidatorRequest,
): Promise<number[]> => 
singleValidatorAxios.get(`${data.params}`).then((res) => {
  return res.data;
});

export const apiGetValidatorSlashes = (
  data: IValidatorRequest,
): Promise<IValidatorSlash[]> => 
singleValidatorAxios.get(`${data.params}`).then((res) => {
  return res.data;
});
