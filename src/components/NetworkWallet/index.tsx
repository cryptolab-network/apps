import styled from 'styled-components';
import WalletSelect from '../WalletSelect';
import NetworkSelect from '../NetworkSelect';
import { useCallback, useEffect, useContext } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { networkChanged, WalletStatus, connectWallet, selectAccount, IAccount } from '../../redux';
import { ApiContext } from '../Api';
import { ApiPromise } from '@polkadot/api';

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


const NetworkWallet: React.FC = () => {
  const dispatch = useAppDispatch();
  const networkName = useAppSelector((state) => state.network.name);
  let { status, filteredAccounts, selectedAccount } = useAppSelector((state) => state.wallet);

  const handleNetworkChange = useCallback(
    (networkName: string) => {
      console.log('current select network: ', networkName);
      dispatch(networkChanged(networkName));
    },
    [dispatch]
  );

  useEffect(() => {
    console.log('networkName: ', networkName);
    dispatch(connectWallet(networkName));
  }, [networkName]);

  const _connectWallet = () => {
    console.log('in connectWallet');
    dispatch(connectWallet(networkName));;
  };
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

  const handleWalletChange = useCallback((e) => {
    console.log('status: ', status);
    console.log('e: ', e);
    switch (status) {
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
  }, []);

  return (
    <Layout>
      <NetworkSelect onChange={handleNetworkChange} />
      <WalletSelect
        onChange={(e) => {
          handleWalletChange(e);
        }}
        accountList={filteredAccounts}
        status={status}
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
