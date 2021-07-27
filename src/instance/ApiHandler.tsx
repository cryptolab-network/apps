import { ApiPromise, WsProvider } from '@polkadot/api';
import keys from '../config/keys';

export enum NetworkName {
  POLKADOT = 'Polkadot',
  KUSAMA = 'Kusama',
}

export interface INetwork {
  name: NetworkName;
}
export class ApiHandler {
  private _api: ApiPromise;
  private _network: string;
  constructor(api: ApiPromise, network: string) {
    this._api = api;
    this._network = network;
  }

  static async create(network: string): Promise<ApiHandler> {
    try {
      const endpoint = network === NetworkName.POLKADOT ? keys.polkadotWSS : keys.kusamaWSS;
      const api = await ApiPromise.create({
        provider: new WsProvider(endpoint, 1000),
      });
      await api.isReadyOrError;
      return new ApiHandler(api, network);
    } catch (err) {
      console.log(err);
      throw Error('create Network');
    }
  }

  getApi(): ApiPromise {
    return this._api;
  }
}
