import { eventStashAxios } from '../../instance/Axios';
import keys from '../../config/keys';

interface IEventParams {
  params: {
    id: string;
    chain: string;
  };
}

interface IEventInfo {
  commissions: {
    commissionFrom: number;
    commissionTo: number;
    address: string;
    era: number;
  }[];
  slashes: {
    era: number;
    validator: string;
    total: number;
  }[];
  inactive: number[];
  stalePayouts: {
    address: string;
    era: number;
    unclaimedPayoutEras: number[];
  }[];
  chills: {
    era: number;
    address: string;
  }[];
  payouts: {
    era: number;
    amount: number;
    address: string;
  }[];
  kicks: {
    era: number;
    address: string;
    nominator: string;
  }[];
  overSubscribes: {
    era: number;
    address: string;
    nominator: string;
    amount: string;
  }[];
}

export interface IEventQuery {
  from_era: number;
  to_era: number;
}

export const apiGetNotificationEvents = (
  data: IEventParams,
  query: IEventQuery | undefined
): Promise<IEventInfo | undefined> => {
  return eventStashAxios
    .get(`${data.params.id}/${data.params.chain}`, { params: query })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if (process.env.REACT_APP_NODE_ENV === 'production') {
        console.clear();
      } else {
        console.warn('in apiGetNotificationEvents, err: ', err);
      }
      return undefined;
    });
};
