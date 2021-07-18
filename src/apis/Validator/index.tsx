import { string } from 'prop-types';
import { validatorAxios } from '../../instance/Axios';
import { IValidator } from '../../instance/CryptoLabHandler';

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
