export enum NetworkNameLowerCase {
  KSM = 'kusama',
  DOT = 'polkadot',
  WND = 'westend',
}

export enum NetworkCodeName {
  KSM = 'KSM',
  DOT = 'DOT',
  WND = 'westend',
}

interface INetworkConfig {
  name: string;
  token: string;
  prefix: number;
  genesisHash: string;
  wss: string;
  maxNominateCount: number;
  decimals: number;
  handlingFee: number;
}

interface INetworkConfigs {
  [key: string]: INetworkConfig;
}

export const NetworkConfig: INetworkConfigs = {
  Polkadot: {
    name: 'Polkadot',
    token: 'DOT',
    prefix: 0,
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
    wss: 'wss://rpc.polkadot.io/',
    maxNominateCount: 16,
    decimals: 10,
    handlingFee: 0.1,
  },
  Kusama: {
    name: 'Kusama',
    token: 'KSM',
    prefix: 2,
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
    wss: 'wss://kusama-rpc.polkadot.io/',
    maxNominateCount: 24,
    decimals: 12,
    handlingFee: 0.1,
  },
  Westend: {
    name: 'Westend',
    token: 'WND',
    prefix: 42,
    genesisHash: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
    wss: 'wss://westend.api.onfinality.io/public-ws',
    maxNominateCount: 16,
    decimals: 12,
    handlingFee: 0.1,
  },
};
