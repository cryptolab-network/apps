import Axios from 'axios';
import keys from '../config/keys';

export default Axios.create({});

export const validatorAxios = Axios.create({
  baseURL: `${keys.apiVersion}validators`,
});

export const nominatorAxios = Axios.create({
  baseURL: `${keys.apiVersion}nominator`,
});
