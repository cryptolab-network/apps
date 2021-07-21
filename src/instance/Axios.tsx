import Axios from 'axios';
import keys from '../config/keys';

export default Axios.create({});

const prefix = `${keys.proxyTarget}${keys.apiVersion}`;

export const validatorAxios = Axios.create({
  baseURL: `${prefix}/validators`,
});

export const nominatorAxios = Axios.create({
  baseURL: `${prefix}/nominator`,
});

export const nominatorsAxios = Axios.create({
  baseURL: `${prefix}/nominators`,
});
