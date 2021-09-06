import React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiGetAllNominators } from '../../../../apis/Nominator';
import keys from '../../../../config/keys';
import { NetworkConfig } from '../../../../utils/constants/Network';

export interface DataProps {
  network: string;
  changeNetwork: Function;
  nominators: {};
  isNominatedLoaded: boolean;
}

export const DataContext = React.createContext({} as unknown as DataProps);

const Data: React.FC = (props) => {
  const [network, setNetwork] = useState(keys.defaultNetwork);
  const [nominators, setNominators] = useState({} as unknown as {});
  const [isNominatedLoaded, setIsNominatedLoaded] = useState(false);

  const changeNetwork = useCallback(
    (target: string) => {
      setNetwork(target);
    },
    [setNetwork]
  );

  const value = useMemo<DataProps>(
    () => ({ network, changeNetwork, nominators, isNominatedLoaded }),
    [network, changeNetwork, nominators, isNominatedLoaded]
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

  return <DataContext.Provider value={value}>{props.children}</DataContext.Provider>;
};

export default Data;
