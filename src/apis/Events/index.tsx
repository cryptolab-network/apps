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
  inactives: number[];
}

export const apiGetNotificationEvents = (data: IEventParams): Promise<IEventInfo> =>
  eventStashAxios.get(`${data.params.id}/${data.params.chain}`).then((res) => {
    return res.data;
  });
