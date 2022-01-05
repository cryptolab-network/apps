import React, { useCallback, useState, useMemo } from 'react';
import { IStashRewards } from '../../apis/StashRewards';
import { IAccountChainInfo } from '../../utils/account';
import dayjs from 'dayjs';

export interface IPerformanceCache {
  kusama: {
    rewardsData: (IStashRewards | null)[];
    accountsData: IAccountChainInfo[];
    expireTime: dayjs.Dayjs | null;
  };
  polkadot: {
    rewardsData: (IStashRewards | null)[];
    accountsData: IAccountChainInfo[];
    expireTime: dayjs.Dayjs | null;
  };
  westend: {
    rewardsData: (IStashRewards | null)[];
    accountsData: IAccountChainInfo[];
    expireTime: dayjs.Dayjs | null;
  };
}

export interface IPPProps {
  performanceCache: IPerformanceCache;
  cachePerformance: Function;
  isPerformanceCacheValid: Function;
}

export const ManagementPageCacheContext = React.createContext({} as unknown as IPPProps);

const ManagementPageCache: React.FC = (props) => {
  const [performanceCache, setPerformanceCache] = useState<IPerformanceCache>(
    {} as unknown as IPerformanceCache
  );

  const cachePerformance = useCallback(
    (rewardsValue: IStashRewards, accountsValue: IAccountChainInfo, networkName: string) => {
      const expireTime = dayjs().add(10, 'minute');
      setPerformanceCache((prev) => ({
        ...prev,
        [networkName.toLowerCase()]: {
          rewardsData: rewardsValue,
          accountsData: accountsValue,
          expireTime: expireTime,
        },
      }));
    },
    []
  );

  const isPerformanceCacheValid = useCallback(
    (networkName: string) => {
      return (
        performanceCache &&
        performanceCache[networkName] &&
        performanceCache[networkName].rewardsData &&
        performanceCache[networkName].rewardsData.length > 0 &&
        performanceCache[networkName].accountsData &&
        performanceCache[networkName].accountsData.length > 0 &&
        performanceCache[networkName].expireTime &&
        performanceCache[networkName].expireTime.isAfter(dayjs(), 'minute')
      );
    },
    [performanceCache]
  );

  const value = useMemo<IPPProps>(
    () => ({
      performanceCache,
      cachePerformance,
      isPerformanceCacheValid,
    }),
    [performanceCache, cachePerformance, isPerformanceCacheValid]
  );

  return (
    <ManagementPageCacheContext.Provider value={value}>{props.children}</ManagementPageCacheContext.Provider>
  );
};

export default ManagementPageCache;
