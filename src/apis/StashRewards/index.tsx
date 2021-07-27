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

export const apiGetStashRewards = (data: ISRRequest): Promise<IStashRewards> =>
  stashRewardsAxios.get(`${data.params}/rewards/collector`, { params: data.query }).then((res) => {
    return res.data;
});