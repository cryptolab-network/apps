import styled from 'styled-components';
import WalletSelect from '../WalletSelect';
import NetworkSelect from '../NetworkSelect';
import { useCallback, useEffect, useContext, useState } from 'react';
import { ApiContext } from '../Api';

const NetworkWallet: React.FC = () => {
  const { network, apiState, accounts, hasWeb3Injected, isWeb3AccessDenied} = useContext(ApiContext);

  const installWallet = () => {
    console.log('in installWallet');
    window.open('https://polkadot.js.org/extension/', '_blank', 'noopener noreferrer');
  };
  const deniedWallet = () => {
    console.log('in deniedWallet');
  };

  const handleWalletChange = useCallback(
    (e) => {
      if (hasWeb3Injected) {
        return installWallet();
      }

      if (isWeb3AccessDenied) {
        return deniedWallet();
      }

      
      // switch (walletStatus) {
      //   case WalletStatus.IDLE:
      //     return _connectWallet();
      //   case WalletStatus.LOADING:
      //     return loadingWallet();
      //   case WalletStatus.NO_EXTENSION:
      //     return installWallet();
      //   case WalletStatus.DENIED:
      //     return deniedWallet();
      //   case WalletStatus.CONNECTED:
      //     return dispatch(selectAccount(e));
      //   default:
      //     break;
      // }
    },
    [hasWeb3Injected, isWeb3AccessDenied]
  );

  return (
    <Layout>
      <NetworkSelect />
      <WalletSelect />
    </Layout>
  );
};

export default NetworkWallet;

const Layout = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
