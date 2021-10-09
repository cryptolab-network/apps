import React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiGetAllNominators } from '../../../../apis/Nominator';
import keys from '../../../../config/keys';
import { NetworkConfig } from '../../../../utils/constants/Network';
import { web3Enable, isWeb3Injected, web3Accounts } from '@polkadot/extension-dapp';
import { accountTransform } from '../../../../redux/walletSlice';

export interface IAccount {
  address: string;
  source: string;
  name?: string;
  genesisHash?: string | null;
}
export interface DataProps {
  network: string;
  changeNetwork: Function;
  nominators: {};
  isNominatedLoaded: boolean;
  hasWeb3Injected: boolean;
  isWeb3AccessDenied: boolean;
  accounts: IAccount[];
  selectedAccount: IAccount;
  selectAccount: Function;
  isLoading: boolean;
}

export const DataContext = React.createContext({} as unknown as DataProps);

const Data: React.FC = (props) => {
  const [network, setNetwork] = useState(keys.defaultNetwork);
  const [nominators, setNominators] = useState({} as unknown as {});
  const [isNominatedLoaded, setIsNominatedLoaded] = useState(false);
  const [hasWeb3Injected, setHasWeb3Injected] = useState(isWeb3Injected);
  const [isWeb3AccessDenied, setIsWeb3AccessDenied] = useState(false);
  const [accounts, setAccounts] = useState([] as unknown as IAccount[]);
  const [selectedAccount, setSelectedAccount] = useState({} as unknown as IAccount);
  const [isLoading, setIsLoading] = useState(true);

  const changeNetwork = useCallback(
    (target: string) => {
      setNetwork(target);
    },
    [setNetwork]
  );

  const selectAccount = useCallback(
    (account: IAccount) => {
      setSelectedAccount(account);
    },
    [setSelectedAccount]
  );

  const value = useMemo<DataProps>(
    () => ({ network, changeNetwork, nominators, isNominatedLoaded, hasWeb3Injected, isWeb3AccessDenied, accounts, selectedAccount, selectAccount, isLoading }),
    [network, changeNetwork, nominators, isNominatedLoaded, hasWeb3Injected, isWeb3AccessDenied, accounts, selectedAccount, selectAccount, isLoading]
  );

  useEffect(() => {
    setIsNominatedLoaded(false);
    apiGetAllNominators({
      params: {
        chain: NetworkConfig[network].token,
      },
    })
      .then((result) => {
        const m = result.reduce((acc, n) => {
          acc[n.accountId] = n;
          return acc;
        }, {});
        setNominators(m);
        setIsNominatedLoaded(true);
      })
      .catch(console.error);
  }, [network]);

  useEffect(() => {
    setIsLoading(true);
    setAccounts([] as unknown as IAccount[]);
    setSelectedAccount({} as unknown as IAccount);
    web3Enable('CryptoLab').then((injected) => {
      setHasWeb3Injected(isWeb3Injected);
      if(injected.length === 0) {
        setIsWeb3AccessDenied(true);
        setIsLoading(false);
      } else {
        setIsWeb3AccessDenied(false);
        web3Accounts().then((injected: any) => {
          const all = injected.map((account) => {
            return {
              address: account.address,
              name: account.meta.name,
              source: account.meta.source,
              genesisHash: account.meta.genesisHash
            }
          });
          const accounts = accountTransform(all, network);
          setAccounts(accounts);
          if (accounts.length > 0) {
            setSelectedAccount(accounts[0]);
          }
          setIsLoading(false);
        }).catch(console.error);
      }
    }).catch(console.error);
  }, [network]);

  return <DataContext.Provider value={value}>{props.children}</DataContext.Provider>;
};

export default Data;
