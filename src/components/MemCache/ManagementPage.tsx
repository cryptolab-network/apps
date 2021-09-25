import React, { useCallback, useState, useMemo } from 'react';
import { IStashRewards } from '../../apis/StashRewards';
import { IAccountChainInfo } from '../../utils/account';
import dayjs from 'dayjs';

export interface IStashRewardsCache {
  data: (IStashRewards | null)[];
  expireTime: dayjs.Dayjs | null;
}

export interface IAccountChainInfoCache {
  data: IAccountChainInfo[];
  expireTime: dayjs.Dayjs | null;
}

export interface IPPProps {
  stashRewardsCache: IStashRewardsCache;
  cacheStashRewards: Function;
  accountChainInfo: IAccountChainInfoCache;
  cacheAccountChainInfo: Function;
}

export const ManagementPageCacheContext = React.createContext({} as unknown as IPPProps);

const ManagementPageCache: React.FC = (props) => {
  const [stashRewardsCache, setStashRewardsCache] = useState<IStashRewardsCache>(
    {} as unknown as IStashRewardsCache
  );
  const [accountChainInfo, setAccountChainInfo] = useState<IAccountChainInfoCache>(
    {} as unknown as IAccountChainInfoCache
  );

  const cacheStashRewards = useCallback((stashRewards: (IStashRewards | null)[]) => {
    console.log(`data has expired, let's update them.`);
    const expireTime = dayjs().add(10, 'minute');
    setStashRewardsCache({
      data: stashRewards,
      expireTime: expireTime,
    });
  }, []);

  const cacheAccountChainInfo = useCallback((accountChainInfo: IAccountChainInfo[]) => {
    console.log(`data has expired, let's update them.`);
    const expireTime = dayjs().add(10, 'minute');
    setAccountChainInfo({
      data: accountChainInfo,
      expireTime: expireTime,
    });
  }, []);

  const value = useMemo<IPPProps>(
    () => ({ stashRewardsCache, cacheStashRewards, accountChainInfo, cacheAccountChainInfo }),
    [stashRewardsCache, cacheStashRewards, accountChainInfo, cacheAccountChainInfo]
  );

  return (
    <ManagementPageCacheContext.Provider value={value}>{props.children}</ManagementPageCacheContext.Provider>
  );
};

export default ManagementPageCache;
