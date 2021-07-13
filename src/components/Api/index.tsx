import React, { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { useAppSelector } from '../../hooks';
import { polkadotWSS, kusamaWSS } from '../../config/keys';

let api: ApiPromise;
export { api };

export const ApiContext = React.createContext({} as unknown as ApiPromise);

const Api: React.FC = (props) => {
  const networkName = useAppSelector(state => state.network.name);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isApiInitialized, setIsApiInitialized] = useState(false);

  useEffect(() => {
    const endpoint = (networkName === 'Polkadot') ? polkadotWSS : kusamaWSS;
    const provider = new WsProvider(endpoint, 1000);
    api = new ApiPromise({ provider });

    api.on('connected', () => { setIsApiConnected(true); console.log(`api connected to ${endpoint}`) });
    api.on('disconnected', () => { setIsApiConnected(false); console.log(`api disconnect from ${endpoint}`) });
    api.on('error', (error) => console.log(error));
    api.on('ready', () => console.log(`api is ready for ${endpoint}`));

    setIsApiInitialized(true);

  }, [networkName]);

  if (!isApiInitialized) {
    return null;
  }

  return (
    <ApiContext.Provider value={api}>
      {props.children}
    </ApiContext.Provider>
  );

}

export default Api;
