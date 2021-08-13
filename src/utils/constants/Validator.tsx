import { NetworkConfig } from './Network';

/*
    while 'support us' switch is on, validators below would be add into the candidate list
*/

export enum CryptolabKSMValidators {
  CRYPTOLAB_NETWORK = 'DBBFZxZqGPb2LSQSA4WHugerXGwm2ivywqdPxVnsJA9oyV3',
  CRYPTOLAB_NETWORK_TANIS = 'GA1WBfVMBReXjWKGnXneC682ZZYustFoc8aTsqXv5fFvi2e',
  DRAGONLANCE = 'H4EeouHL5LawTqq2itu6auF62hDRX2LEBYk1TxS6QMrn9Hg',
  DRAGONLANCE_KRYNN = 'HRfhckygfiHkqVW19e71R2pXNbR6om7138sLAJENt2Tw1HF',
  HSINCHU = 'CjU6xRgu5f9utpaCbYHBWZGxZPrpgUPSSXqSQQG5mkH9LKM',
  TAICHUNG = 'CjU6xRgu5f9utpaCbYHBWZGxZPrpgUPSSXqSQQG5mkH9LKM',
  TAIWAN_001 = 'GCNeCFUCEjcJ8XQxJe1QuExpS61MavucrnEAVpcngWBYsP2',
  CRYPTOLAB_01 = '16iiKwFsRKRsjAiEpD4zgNgEX84nzHtHHNFKXhz1sHtan3ne',
}

export enum CryptolabDOTValidators {
  CRYPTOLAB_01 = '16iiKwFsRKRsjAiEpD4zgNgEX84nzHtHHNFKXhz1sHtan3ne',
  CRYPTOLAB_NETWORK = '14AzFH6Vq1Vefp6eQYPK8DWuvYuUm3xVAvcN9wS352QsCH8L',
}

export enum CandidateNumber {
  KSM = 24,
  DOT = 16,
  WND = 16,
}

export const getCandidateNumber = (networkName: string) => {
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
