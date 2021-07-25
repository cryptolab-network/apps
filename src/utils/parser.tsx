enum NetworkNameLowerCase {
  KSM = 'kusama',
  DOT = 'polkadot',
}

export const networkCapitalCodeName = (inputNetworkName: string): string => {
  if (String(inputNetworkName).toLowerCase() === NetworkNameLowerCase.KSM) {
    return 'KSM';
  } else if (String(inputNetworkName).toLowerCase() === NetworkNameLowerCase.DOT) {
    return 'DOT';
  } else {
    return '???';
  }
};
