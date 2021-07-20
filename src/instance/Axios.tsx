import Axios from 'axios';
import keys from '../config/keys';

export default Axios.create({});

export const validatorAxios = Axios.create({
  baseURL: `${keys.apiVersion}/api/v1/validators`,
});

export const singleValidatorAxios = Axios.create({
  baseURL: `${keys.apiVersion}/api/v1/validator`,
});

export const nominatorAxios = Axios.create({
  baseURL: `${keys.apiVersion}nominator`,
});
