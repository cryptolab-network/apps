import { nominatorAxios, nominatorsAxios } from '../../instance/Axios';

export interface INominatorInfo {
  accountId: string;
  balance: {
    free_balance: number;
    locked_balance: number;
  };
  targets: string[];
  rewards: {
    stash: string;
    eraRewards: {
      era: number;
      amount: number;
      timestamp: number;
      price: number;
      total: number;
    }[];
  };
}
export interface INominatorParams {
  chain: string;
  id: string;
}
export interface INominator {
  params: INominatorParams;
}

export interface INominatorsParams {
  chain: string;
}

export interface INominators {
  params: INominatorsParams;
}

export const apiGetInfoNominator = (data: INominator): Promise<INominatorInfo> =>
  nominatorAxios.get(`${data.params.id}/${data.params.chain}`).then((res) => {
    return res.data;
  });

export const apiGetAllNominators = (data: INominators): Promise<INominatorInfo[]> =>
  nominatorsAxios.get(`${data.params.chain}`).then((res) => {
    return res.data;
  });
