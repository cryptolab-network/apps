import Axios from 'axios';
import keys from '../config/keys';

export default Axios.create({});

const prefix = `${keys.proxyTarget}${keys.apiVersion}`;

export const validatorAxios = Axios.create({
  baseURL: `${prefix}/validators`,
});

export const singleValidatorAxios = Axios.create({
  baseURL: `${prefix}/validator`,
});

export const nominatorAxios = Axios.create({
  baseURL: `${prefix}/nominator`,
});

export const nominatorsAxios = Axios.create({
  baseURL: `${prefix}/nominators`,
});

export const validatorOneKVAxios = Axios.create({
  baseURL: `${prefix}/1kv/validators`,
});

export const nominatorOneKVAxios = Axios.create({
  baseURL: `${prefix}/1kv/nominators`,
});

export const stashRewardsAxios = Axios.create({
  baseURL: `${prefix}/stash/`,
});

export const nominatedValidatorsAxios = Axios.create({
  baseURL: `${prefix}/nominated/`,
});

export const subscribeNewsletterAxios = Axios.create({
  baseURL: `${prefix}/newsletter/`,
});

export const eventStashAxios = Axios.create({
  baseURL: `${prefix}/events/stash/`,
});
