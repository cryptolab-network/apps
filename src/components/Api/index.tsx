import React, { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { polkadotWSS, kusamaWSS } from '../../config/keys';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { NetworkStatus } from '../../utils/status/Network';
import { networkStatusChanged } from '../../redux';

let api: ApiPromise;
export { api };

export const ApiContext = React.createContext({} as unknown as ApiPromise);

const Api: React.FC = (props) => {
  const networkName = useAppSelector((state) => state.network.name);
  const dispatch = useAppDispatch();
  // const [isApiConnected, setIsApiConnected] = useState(false);
  const [isApiInitialized, setIsApiInitialized] = useState(false);

  useEffect(() => {
    const endpoint = networkName === 'Polkadot' ? polkadotWSS : kusamaWSS;
    const provider = new WsProvider(endpoint, 1000);
    api = new ApiPromise({ provider });

    api.on('connected', () => {
      dispatch(networkStatusChanged(NetworkStatus.CONNECTED));
      console.log(`api connected to ${endpoint}`);
    });
    api.on('disconnected', () => {
      dispatch(networkStatusChanged(NetworkStatus.DISCONNECTED));
      console.log(`api disconnect from ${endpoint}`);
    });
    api.on('error', (error) => {
      dispatch(networkStatusChanged(NetworkStatus.ERROR));
      console.log(error);
    });
    api.on('ready', () => {
      dispatch(networkStatusChanged(NetworkStatus.READY));
      console.log(`api is ready for ${endpoint}`);
    });

    setIsApiInitialized(true);
  }, [networkName, dispatch]);

  if (!isApiInitialized) {
    return null;
  }

  return <ApiContext.Provider value={api}>{props.children}</ApiContext.Provider>;
};

export default Api;
