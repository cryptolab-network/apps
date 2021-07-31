import styled from 'styled-components';
import WalletSelect from '../WalletSelect';
import NetworkSelect from '../NetworkSelect';
import { useCallback, useEffect, useContext, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  networkChanged,
  WalletStatus,
  connectWallet,
  selectAccount,
  setWalletStatus,
  IAccount,
  setFilteredAccounts,
  setSelectedAccountBalances,
} from '../../redux';
import { NetworkStatus } from '../../utils/status/Network';
import { ApiContext } from '../Api';

const NetworkWallet: React.FC = () => {
  const dispatch = useAppDispatch();
  let { name: networkName, status: networkStatus } = useAppSelector((state) => state.network);
  let { status: walletStatus, filteredAccounts, selectedAccount } = useAppSelector((state) => state.wallet);
  const polkadotApi = useContext(ApiContext);

  const handleNetworkChange = useCallback(
    async (networkName: string) => {
      dispatch(networkChanged(networkName));
    },
    [dispatch]
  );

  useEffect(() => {
    if (networkStatus === NetworkStatus.READY) {
      dispatch(connectWallet(networkName));
    } else {
      // network is not ready, force wallet status loading
      dispatch(setWalletStatus(WalletStatus.LOADING));
    }
  }, [networkName, networkStatus, dispatch]);

  const balance = useCallback(
    async (account: IAccount) => {
      if (polkadotApi && networkStatus === NetworkStatus.READY) {
        console.log('NetworkWallet: api ready');
        const result = await polkadotApi.derive.balances.all(account.address);
        return {
          totalBalance: result.freeBalance.add(result.reservedBalance).toString(),
          freeBalance: result.freeBalance.toString(),
          reservedBalance: result.reservedBalance.toString(),
          lockedBalance: result.lockedBalance.toString(),
          availableBalance: result.availableBalance.toString(0),
        }
      } else {
        console.log('NetworkWallet: api IS NOT ready');
        return {
          totalBalance: '0',
          freeBalance: '0',
          reservedBalance: '0',
          lockedBalance: '0',
          availableBalance: '0',
        };
      }
    },
    [polkadotApi, networkStatus]
  );

  useEffect(() => {
    (async () => {
      let update = false;
      let tempAccounts: IAccount[] = [];
      for (let idx = 0; idx < filteredAccounts.length; idx++) {
        console.log(`idx = ${idx}`);
        const result = await balance(filteredAccounts[idx]);
        tempAccounts.push({
          address: filteredAccounts[idx].address,
          name: filteredAccounts[idx].name,
          source: filteredAccounts[idx].source,
          genesisHash: filteredAccounts[idx].genesisHash,
          balances: result
        });
        if (filteredAccounts[idx].balances.totalBalance !== result.totalBalance ||
            filteredAccounts[idx].balances.freeBalance !== result.freeBalance ||
            filteredAccounts[idx].balances.reservedBalance !== result.reservedBalance ||
            filteredAccounts[idx].balances.lockedBalance !== result.lockedBalance ||
            filteredAccounts[idx].balances.availableBalance !== result.availableBalance
        ) {
          update = true;
        }
      }
      if (update) {
        dispatch(setFilteredAccounts(tempAccounts));
      }
    })();
  }, [filteredAccounts, balance]);

  useEffect(() => {
    (async () => {
      if (selectedAccount) {
        let update = false;
        const result = await balance(selectedAccount);
        let tempSelectedAccount: IAccount = {
          address: selectedAccount.address,
          name: selectedAccount.name,
          source: selectedAccount.source,
          genesisHash: selectedAccount.genesisHash,
          balances: result
        };
        if (selectedAccount.balances.totalBalance !== result.totalBalance ||
          selectedAccount.balances.freeBalance !== result.freeBalance ||
          selectedAccount.balances.reservedBalance !== result.reservedBalance ||
          selectedAccount.balances.lockedBalance !== result.lockedBalance ||
          selectedAccount.balances.availableBalance !== result.availableBalance
        ) {
          update = true;
          dispatch(setSelectedAccountBalances(result));
        }
      }
    })();
  }, [selectedAccount, balance]);

  const _connectWallet = useCallback(() => {
    console.log('in connectWallet');
    dispatch(connectWallet(networkName));
  }, [dispatch, networkName]);
  const loadingWallet = () => {
    console.log('in loadingWallet');
  };
  const installWallet = () => {
    console.log('in installWallet');
    window.open('https://polkadot.js.org/extension/', '_blank', 'noopener noreferrer');
  };
  const deniedWallet = () => {
    console.log('in deniedWallet');
  };

  const handleWalletChange = useCallback(
    (e) => {
      console.log('status: ', walletStatus);

      switch (walletStatus) {
        case WalletStatus.IDLE:
          return _connectWallet();
        case WalletStatus.LOADING:
          return loadingWallet();
        case WalletStatus.NO_EXTENSION:
          return installWallet();
        case WalletStatus.DENIED:
          return deniedWallet();
        case WalletStatus.CONNECTED:
          return dispatch(selectAccount(e));
        default:
          break;
      }
    },
    [walletStatus, _connectWallet, dispatch]
  );

  return (
    <Layout>
      <NetworkSelect onChange={handleNetworkChange} />
      <WalletSelect
        onChange={(e) => {
          handleWalletChange(e);
        }}
        accountList={filteredAccounts}
        status={walletStatus}
        selectedAccount={selectedAccount}
      />
    </Layout>
  );
};

export default NetworkWallet;

const Layout = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
