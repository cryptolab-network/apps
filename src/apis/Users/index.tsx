import { nominateAxios } from "../../instance/Axios";

export interface INominationRequest {
    chain: string
    body: {
      stash: string
      validators: string[]
      amount: number
      strategy: number
      extrinsicHash: string
    }
}

export const apiPostNomination = (data: INominationRequest): Promise<void> =>
  nominateAxios.post(`${data.chain}/rewards/collector`, { params: data.body }).then((res) => {
    return res.data;
});