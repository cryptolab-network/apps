import React from 'react';
import Raact, { useState, useEffect, useCallback, useMemo } from 'react';

export interface DataProps {
  network: string;
  changeNetwork: Function;
}

export const DataContext = React.createContext({} as unknown as DataProps);

const Data: React.FC = (props) => {
  const [network, setNetwork] = useState('Kusama');

  const changeNetwork = useCallback (
    (target: string) => {
      setNetwork(target);
    },
    [setNetwork, network]
  );

  const value = useMemo<DataProps>(
    () => ({ network, changeNetwork }),
    [network, changeNetwork]
  );

  return <DataContext.Provider value={value}>{props.children}</DataContext.Provider>;
}

export default Data;