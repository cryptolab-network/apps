import { nominatorOneKVAxios } from "../../instance/Axios";
import { IValidatorRequest } from "../Validator";

export interface INomination {
  stash: string,
  name: string,
  elected: boolean
}

export interface IOneKVNominator {
  current: INomination[],
  lastNomination: string
}

export interface IOneKVNominators {
  activeEra: number,
  nominators: IOneKVNominator[]
}

export const apiGetOneKVNominators = (data: IValidatorRequest): Promise<IOneKVNominators> =>
  nominatorOneKVAxios.get(`${data.params}`, { params: data.query }).then((res) => {
  return res.data;
});