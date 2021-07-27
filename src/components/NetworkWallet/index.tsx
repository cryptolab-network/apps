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
  // setFilteredAccounts,
} from '../../redux';
import { NetworkStatus } from '../../utils/status/Network';
import { ApiContext } from '../Api';
// import { ApiPromise } from '@polkadot/api';

// TODO: please remove this mock data before production
// const mockWalletList = [
//   {
//     accountName: 'CryptoLab01',
//     address: '14AzFH6Vq1Vefp6eQYPK8DWuvYuUm3xVAvcN9wS352QsCH8L',
//     balance: '1234',
//   },
//   {
//     accountName: 'CryptoLab02',
//     address: '14AzFH6Vq1Vefp6eQYPK8DWuvYuUm3xVAvcN9wS352QsCH8L',
//     balance: '2345',
//   },
// ];
// TODO: please remove this mock data before production
// const mockWalletStatus: number = WalletStatus.IDLE;
// const mockWalletStatus: number = WalletStatus.LOADING;
// const mockWalletStatus: number = WalletStatus.NO_EXTENSION;
// const mockWalletStatus: number = WalletStatus.DENIED;
// const mockWalletStatus: number = WalletStatus.CONNECTED;

// const ParseNetworkStatus = (status) => {
//   switch (status) {
//     case NetworkStatus.CONNECTED:
//       return 'CONNECTED';
//     case NetworkStatus.DISCONNECTED:
//       return 'DISCONNECTED';
//     case NetworkStatus.ERROR:
//       return 'ERROR';
//     case NetworkStatus.READY:
//       return 'READY';

//     default:
//       break;
//   }
// };

const NetworkWallet: React.FC = () => {
  const dispatch = useAppDispatch();
  let { name: networkName, status: networkStatus } = useAppSelector((state) => state.network);
  let { status: walletStatus, filteredAccounts, selectedAccount } = useAppSelector((state) => state.wallet);
  const polkadotApi = useContext(ApiContext);
  const [accountList, setAccountList] = useState<IAccount[]>([]);
  const [localSelectedAccount, setLocalSeletedAccount] = useState<IAccount | null>(null);

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
        const result = await polkadotApi.derive.balances.account(account.address);
        return result.freeBalance.toHuman();
      } else {
        console.log('NetworkWallet: api IS NOT ready');
        return '';
      }
    },
    [polkadotApi, networkStatus]
  );

  useEffect(() => {
    (async () => {
      let tempAccounts: IAccount[] = [];
      for (let idx = 0; idx < filteredAccounts.length; idx++) {
        tempAccounts.push({
          address: filteredAccounts[idx].address,
          name: filteredAccounts[idx].name,
          source: filteredAccounts[idx].source,
          genesisHash: filteredAccounts[idx].genesisHash,
          balance: await balance(filteredAccounts[idx]),
        });
      }
      setAccountList(tempAccounts);
    })();
  }, [filteredAccounts, balance]);

  useEffect(() => {
    (async () => {
      if (selectedAccount) {
        let tempSelectedAccount: IAccount = {
          address: selectedAccount.address,
          name: selectedAccount.name,
          source: selectedAccount.source,
          genesisHash: selectedAccount.genesisHash,
          balance: await balance(selectedAccount),
        };
        setLocalSeletedAccount(tempSelectedAccount);
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
        accountList={accountList}
        status={walletStatus}
        selectedAccount={localSelectedAccount}
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
