
import axios from "axios";
import { cryptoLabBackendUrl } from '../config/keys';

export interface IStatusChange {
  commissionChange: number
}

export interface IIdentity {
  display: string
}

export interface INominator {
  address: string
  balance: number
}

export interface IExposureOthers {
  who: string
  value: number
}

export interface IExposure {
  total: number
  own: number
  others: IExposureOthers[]
}

export interface IEraInfo {
  nominators: INominator[]
  nominatorCount: number
  era: number
  exposure: IExposure
  commission: number
  apy: number
  unclaimedEras: number[]
  total: number
}

export interface IValidator {
  id: string
  statusChange: IStatusChange
  identity: IIdentity
  info: IEraInfo
  averageApy: number
  favorite: boolean
}

export class CryptoLabHandler {
  url: string
  constructor() {
    this.url = cryptoLabBackendUrl;
  }

  async getAllValidators(chain: string): Promise<IValidator[]> {
    const resp = await axios.get(`${this.url}/api/v1/validators/${chain}`);
    if (resp.status === 200) {
      try {
        const validators: IValidator[] = resp.data;
        return validators;
      } catch (err) {
        throw new Error(`Failed to parse validators from backend. ${err}`);
      }
    } else {
      throw new Error('Failed to get validator info from backend');
    }
  }
}

