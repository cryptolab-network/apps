import { string } from 'prop-types';
import { validatorAxios } from '../../instance/Axios';

export interface IValidatorInfoList {
  id: string;
  statusChange: {
    commission: number;
  };
  identity: {
    display: string;
    parent: string;
    sub: string;
    isVerified: boolean;
  };
  stakerPoints: {
    era: number;
    points: number;
  }[];
  averageApy: number;
  info: {
    nominatorCount: number;
    era: number;
    commission: number;
    apy: number;
    total: number;
    nominators: {
      address: string;
      balance: number;
    }[];
    exposure: {
      total: number;
      own: number;
      others: {
        who: string;
        value: number;
      }[];
    };
    unclaimedEras: number[];
  };
  slashes: {
    era: number;
    validator: string;
    total: number;
    others: {
      address: string;
      value: number;
    }[];
  }[];
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
export interface IValidator {
  params: string;
  query?: IValidatorQuery;
}
export const apiGetAllValidator = (data: IValidator): Promise<IValidatorInfoList[]> =>
  validatorAxios.get(`${data.params}`, { params: data.query }).then((res) => {
    return res.data;
  });
