import { NetworkNameLowerCase } from './constants/Network';

export const networkCapitalCodeName = (inputNetworkName: string): string => {
  if (String(inputNetworkName).toLowerCase() === NetworkNameLowerCase.KSM) {
    return 'KSM';
  } else if (String(inputNetworkName).toLowerCase() === NetworkNameLowerCase.DOT) {
    return 'DOT';
  } else if (String(inputNetworkName).toLowerCase() === NetworkNameLowerCase.WND) {
    return 'WND';
  } else {
    return '---';
  }
};
