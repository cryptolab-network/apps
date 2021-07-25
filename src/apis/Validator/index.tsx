import { singleValidatorAxios, validatorAxios } from '../../instance/Axios';

export interface IStatusChange {
  commissionChange: number
}

export interface IIdentity {
  display: string
}

export interface INominator {
  address: string
  balance: number
}

export interface IExposureOthers {
  who: string
  value: number
}

export interface IExposure {
  total: number
  own: number
  others: IExposureOthers[]
}

export interface IEraInfo {
  nominators: INominator[]
  nominatorCount: number
  era: number
  exposure: IExposure
  commission: number
  apy: number
  unclaimedEras: number[]
  total: number
  selfStake: number
}

export interface IValidator {
  id: string
  statusChange: IStatusChange
  identity: IIdentity
  info: IEraInfo
  averageApy: number
  favorite: boolean
}

export interface IValidatorHistory {
  id: string
  statusChange: IStatusChange
  identity: IIdentity
  info: IEraInfo[]
  averageApy: number
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
}
export const apiGetAllValidator = (data: IValidatorRequest): Promise<IValidator[]> =>
validatorAxios.get(`${data.params}`, { params: data.query }).then((res) => {
  return res.data;
});
export const apiGetSingleValidator = (data: IValidatorRequest): Promise<IValidatorHistory> =>
singleValidatorAxios.get(`${data.params}`, { params: data.query }).then((res) => {
  if (res.data.length > 0) {
    return res.data[0];
  } else {
    throw new Error('The stash is not a validaor');
  }
});
