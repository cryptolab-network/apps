import { validatorAxios } from '../../instance/Axios';

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
export const apiGetAllValidator = (data: IValidator) =>
  validatorAxios.get(`${data.params}`, { params: data.query }).then((res) => {
    return res.data;
  });
