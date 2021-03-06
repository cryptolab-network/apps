import { NetworkConfig } from './Network';

/*
    while 'support us' switch is on, validators below would be add into the candidate list
*/

export enum CryptolabKSMValidators {
  CRYPTOLAB_NETWORK = 'DBBFZxZqGPb2LSQSA4WHugerXGwm2ivywqdPxVnsJA9oyV3',
  CRYPTOLAB_NETWORK_TANIS = 'GA1WBfVMBReXjWKGnXneC682ZZYustFoc8aTsqXv5fFvi2e',
}

export enum CryptolabDOTValidators {
  CRYPTOLAB_01 = '16iiKwFsRKRsjAiEpD4zgNgEX84nzHtHHNFKXhz1sHtan3ne',
  CRYPTOLAB_NETWORK = '14AzFH6Vq1Vefp6eQYPK8DWuvYuUm3xVAvcN9wS352QsCH8L',
}

export enum CryptolabKSMValidatorsName {
  CRYPTOLAB_NETWORK = 'CRYPTOLAB.NETWORK',
  CRYPTOLAB_NETWORK_TANIS = 'CRYPTOLAB.NETWORK/TANIS',
}

export enum CryptolabDOTValidatorsName {
  CRYPTOLAB_01 = 'CRYPTOLAB 01',
  CRYPTOLAB_NETWORK = 'CRYPTOLAB.NETWORK',
}

export enum CandidateNumber {
  KSM = 24,
  DOT = 16,
  WND = 16,
}

export const getCandidateNumber = (networkName: string): number => {
  if (NetworkConfig[networkName] !== undefined) {
    return NetworkConfig[networkName].maxNominateCount;
  } else {
    return 0;
  }
  // const inputNetworkName = networkName.toLowerCase();
  // if (inputNetworkName === NetworkNameLowerCase.KSM || inputNetworkName === NetworkCodeName.KSM) {
  //   return CandidateNumber.KSM;
  // } else if (inputNetworkName === NetworkNameLowerCase.DOT || inputNetworkName === NetworkCodeName.DOT) {
  //   return CandidateNumber.DOT;
  // } else if (inputNetworkName === NetworkNameLowerCase.WND || inputNetworkName === NetworkCodeName.WND) {
  //   return CandidateNumber.WND;
  // } else {
  //   return 0;
  // }
};
