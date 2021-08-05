import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import keys from '../../config/keys';
import { web3Enable, isWeb3Injected, web3Accounts } from '@polkadot/extension-dapp';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

const networkInfo = [
  {
    name: 'Polkadot',
    prefix: 0,
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
  },
  {
    name: 'Kusama',
    prefix: 2,
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
  },
];

export enum ApiState {
  DISCONNECTED,
  CONNECTED,
  READY,
  ERROR,
}
export interface IBalance {
  totalBalance: string;
  freeBalance: string;
  reservedBalance: string;
  lockedBalance: string;
  availableBalance: string;
}
export interface IAccount {
  address: string;
  name?: string;
  balances: IBalance;
  genesisHash?: string | null;
}
export interface ApiProps {
  network: string;
  changeNetwork: Function;
  api: ApiPromise;
  isApiInitialized: boolean;
  apiState: ApiState;
  hasWeb3Injected: boolean;
  isWeb3AccessDenied: boolean;
  accounts: IAccount[];
  selectedAccount: IAccount;
  selectAccount: Function;
  isLoading: boolean;
}

const accountTransform = (accounts: IAccount[], network: string): IAccount[] => {
  const info = networkInfo.find((info) => info.name === network);
  const filtered = accounts.filter((account) => {
    return account.genesisHash === null || account.genesisHash === info?.genesisHash;
  });

  return filtered.map((account) => {
    const address = encodeAddress(
      isHex(account.address) ? hexToU8a(account.address) : decodeAddress(account.address),
      info?.prefix
    );
    return {
      address,
      name: account.name,
      balances: account.balances,
      genesisHash: account.genesisHash,
    };
  });
};

const queryBalances = async (accounts: IAccount[], api: ApiPromise) => {
  const temp = await Promise.all(
    accounts.map((account) => 
      api.derive.balances.all(account.address).then((balances) => {
        return {
          address: account.address,
          name: account.name,
          genesisHash: account.genesisHash,
          balances: {
            totalBalance: balances.freeBalance.add(balances.reservedBalance).toString(),
            freeBalance: balances.freeBalance.toString(),
            reservedBalance: balances.reservedBalance.toString(),
            lockedBalance: balances.lockedBalance.toString(),
            availableBalance: balances.availableBalance.toString()
          }
        }
      })
    )
  )
  return temp;
}

let api: ApiPromise;
export { api };

export const ApiContext = React.createContext({} as unknown as ApiProps);

const Api: React.FC = (props) => {
  const [network, setNetwork] = useState('Kusama');
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [apiState, setApiState] = useState(ApiState.DISCONNECTED);
  const [hasWeb3Injected, setHasWeb3Injected] = useState(isWeb3Injected);
  const [isWeb3AccessDenied, setIsWeb3AccessDenied] = useState(false);
  const [accounts, setAccounts] = useState([] as unknown as IAccount[]);
  const [selectedAccount, setSelectedAccount] = useState({} as unknown as IAccount);
  const [isLoading, setIsLoading] = useState(true);

  const changeNetwork = useCallback(
    (target: string) => {
      if (target !== network) {
        setApiState(ApiState.DISCONNECTED);
        setNetwork(target);
        setIsLoading(true);
        setSelectedAccount({} as unknown as IAccount);
      }
    },
    [setNetwork, network]
  );

  const selectAccount = useCallback(
    (account: IAccount) => {
      setSelectedAccount(account);
    },
    [setSelectedAccount]
  );

  const value = useMemo<ApiProps>(
    () => ({network, changeNetwork, api, isApiInitialized, apiState, hasWeb3Injected, isWeb3AccessDenied, accounts, selectedAccount, selectAccount, isLoading}),
    [network, changeNetwork, api, isApiInitialized, apiState, hasWeb3Injected, isWeb3AccessDenied, accounts, selectedAccount, selectAccount, isLoading]
  );

  useEffect(() => {
    if (apiState === ApiState.READY) {
      web3Accounts().then((injected: any) => {
        const all = injected.map((account) => {
          return {
            address: account.address,
            name: account.meta.name,
            source: account.meta.source,
            genesisHash: account.meta.genesisHash,
            balances: {
              totalBalance: '0',
              freeBalance: '0',
              reservedBalance: '0',
              lockedBalance: '0',
              availableBalance: '0',
            }
          }
        });
        
        const accounts = accountTransform(all, network);
        queryBalances(accounts, api).then((accountsWithBalances) => {
          setAccounts(accountsWithBalances);
          if (accountsWithBalances.length > 0) {
            setSelectedAccount(accountsWithBalances[0]);
          }
          setIsLoading(false);
        }).catch(console.error);
  
      }).catch(console.error);
    }
  }, [isWeb3AccessDenied, hasWeb3Injected, apiState])

  useEffect(() => {
    const endpoint = network === 'Polkadot' ? keys.polkadotWSS : keys.kusamaWSS;
    const provider = new WsProvider(endpoint, 1000);
    api = new ApiPromise({ provider });

    api.on('connected', () => {
      setApiState(ApiState.CONNECTED);
      console.log(`api connected to ${endpoint}`);
    });
    api.on('disconnected', () => {
      setApiState(ApiState.CONNECTED);
      console.log(`api disconnect from ${endpoint}`);
    });
    api.on('error', (error) => {
      setApiState(ApiState.ERROR);
      console.log(error);
    });
    api.on('ready', () => {
      setApiState(ApiState.READY);
      console.log(`api is ready for ${endpoint}`);

      web3Enable('CryptoLab').then((injected) => {
        if (isWeb3Injected !== hasWeb3Injected) {
          setHasWeb3Injected(isWeb3Injected);
        }
        if (injected.length === 0) {
          setIsWeb3AccessDenied(true);
        } else {
          setIsWeb3AccessDenied(false);
        }
      }).catch(console.error);

    });

    setIsApiInitialized(true);
  }, [network]);

  if (!isApiInitialized) {
    return null;
  }

  return <ApiContext.Provider value={value}>{props.children}</ApiContext.Provider>;
};

export default Api;
