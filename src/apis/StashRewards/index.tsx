import { stashRewardsAxios } from "../../instance/Axios";

export interface IEraRewards {
  era: number;
  amount: number;
  timestamp: number;
  price: number;
  total: number;
}

export interface IStashRewards {
  stash: string;
  eraRewards: IEraRewards[];
  totalInFiat: number;
}

export interface ISRQuery {
  startDate: string;
  endDate: string;
  currency: string;
}

export interface ISRRequest {
  params: string;
  query: ISRQuery;
}

export interface ISRDownloadRequest {
  params: string;
}

export const apiGetStashRewards = (data: ISRRequest): Promise<IStashRewards> =>
  stashRewardsAxios.get(`${data.params}/rewards/collector`, { params: data.query }).then((res) => {
    return res.data;
});

export const apiGetStashRewardsCSV = (data: ISRDownloadRequest): Promise<any> => {
  return stashRewardsAxios.get(`${data.params}/rewards/collector/csv`, {}).then((res) => {
    return res.data;
  });
};

export const apiGetStashRewardsJSON = (data: ISRDownloadRequest): Promise<any> => {
  return stashRewardsAxios.get(`${data.params}/rewards/collector/json`, {}).then((res) => {
    return res.data;
  });
};