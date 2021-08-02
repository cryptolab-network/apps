import React from 'react';
import Raact, { useState, useEffect, useCallback, useMemo } from 'react';
import { apiGetAllNominators } from '../../../../apis/Nominator';

export interface DataProps {
  network: string;
  changeNetwork: Function;
  nominators: {};
  isNominatedLoaded: boolean;
}

export const DataContext = React.createContext({} as unknown as DataProps);

const Data: React.FC = (props) => {
  const [network, setNetwork] = useState('Kusama');
  const [nominators, setNominators] = useState({} as unknown as {});
  const [isNominatedLoaded, setIsNominatedLoaded] = useState(false);

  const changeNetwork = useCallback (
    (target: string) => {
      setNetwork(target);
    },
    [setNetwork, network]
  );

  const value = useMemo<DataProps>(
    () => ({ network, changeNetwork, nominators, isNominatedLoaded }),
    [network, changeNetwork, nominators, isNominatedLoaded]
  );

  useEffect(() => {
    setIsNominatedLoaded(false);
    apiGetAllNominators({
      params: {
        chain: (network === 'Kusama') ? 'KSM' : 'DOT'
      }
    }).then((result) => {
      const m = result.reduce((acc, n) => {
        acc[n.accountId] = n;
        return acc;
      }, {});
      setNominators(m);
      setIsNominatedLoaded(true);
    }).catch(console.error);
  },[network])

  return <DataContext.Provider value={value}>{props.children}</DataContext.Provider>;
}

export default Data;