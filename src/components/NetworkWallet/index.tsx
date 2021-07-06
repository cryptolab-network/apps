import styled from 'styled-components';
import WalletSelect from '../WalletSelect';
import NetworkSelect from '../NetworkSelect';
import { useCallback } from 'react';
import { useAppDispatch } from '../../hooks';
import { networkChanged, WalletStatus } from '../../redux';
import { useState } from 'react';

// TODO: please remove this mock data before production
const mockWalletList = [
  {
    accountName: 'CryptoLab01',
    address: '14AzFH6Vq1Vefp6eQYPK8DWuvYuUm3xVAvcN9wS352QsCH8L',
    balance: '1234',
  },
  {
    accountName: 'CryptoLab02',
    address: '14AzFH6Vq1Vefp6eQYPK8DWuvYuUm3xVAvcN9wS352QsCH8L',
    balance: '2345',
  },
];
// TODO: please remove this mock data before production
// const mockWalletStatus: number = WalletStatus.IDLE;
// const mockWalletStatus: number = WalletStatus.LOADING;
// const mockWalletStatus: number = WalletStatus.NO_EXTENSION;
// const mockWalletStatus: number = WalletStatus.DENIED;
const mockWalletStatus: number = WalletStatus.CONNECTED;

const NetworkWallet: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedWallet, setSelectedWallet] = useState();

  const handleNetworkChange = useCallback(
    (networkName: string) => {
      console.log('current select network: ', networkName);
      dispatch(networkChanged(networkName));
    },
    [dispatch]
  );

  const connectWallet = () => {
    console.log('in connectWallet');
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
  const setWallet = (wallet) => {
    console.log('in setWallet', wallet);
    setSelectedWallet(wallet);
  };

  const handleWalletChange = useCallback((e) => {
    switch (mockWalletStatus) {
      case WalletStatus.IDLE:
        return connectWallet();
      case WalletStatus.LOADING:
        return loadingWallet();
      case WalletStatus.NO_EXTENSION:
        return installWallet();
      case WalletStatus.DENIED:
        return deniedWallet();
      case WalletStatus.CONNECTED:
        return setWallet(e);
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
        walletList={mockWalletList}
        status={mockWalletStatus}
        selectedWallet={selectedWallet}
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
