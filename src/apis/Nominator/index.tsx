import { nominatorAxios } from '../../instance/Axios';

export interface INominatorParams {
  chain: string;
  id: string;
}
export interface INominator {
  params: INominatorParams;
}
export const apiGetInfoNominator = (data: INominator) =>
  nominatorAxios.get(`${data.params.id}/${data.params.chain}`).then((res) => {
    return res.data;
  });
