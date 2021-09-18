import { eventStashAxios } from '../../instance/Axios';

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
  payouts: {
    era: number;
    amount: number;
    address: string;
  }[];
}

export const apiGetNotificationEvents = (data: IEventParams): Promise<IEventInfo | undefined> =>
  eventStashAxios
    .get(`${data.params.id}/${data.params.chain}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.warn('in apiGetNotificationEvents, err: ', err);
      return undefined;
    });
