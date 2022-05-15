import styled from 'styled-components';
import CardHeader from '../../../components/Card/CardHeader';
import CardHeaderFullWidth from '../../../components/Card/CardHeaderFullWidth';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useMemo, useState } from 'react';
import { hasValues } from '../../../utils/helper';
import { IAccountChainInfo, queryStakingInfo } from '../../../utils/account';
import { ApiContext, IAccount } from '../../../components/Api';
import { ApiState } from '../../../components/Api';
import { ManagementPageCacheContext } from '../../../components/MemCache/ManagementPage';
import { apiGetStashRewards, IStashRewards } from '../../../apis/StashRewards';
import moment from 'moment';
import CustomScaleLoader from '../../../components/Spinner/ScaleLoader';
import PortfolioTable from './PortFolioTable';
import ProfitChart from './ProfitCharts';
import Empty from '../../../components/Empty';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { breakWidth } from '../../../utils/constants/layout';

interface INetworkReady {
  kusama: boolean;
  polkadot: boolean;
}

interface IAccountsInfo {
  accounts: IAccountChainInfo[];
  rewards: IStashRewards | null;
}

const PerformanceHeader = () => {
  const { t } = useTranslation();
  return (
    <HeaderLayout>
      <HeaderLeft>
        <HeaderTitle>
          <Title>{t('pm.performance.title')}</Title>
          <Subtitle>{t('pm.performance.subtitle')}</Subtitle>
        </HeaderTitle>
      </HeaderLeft>
    </HeaderLayout>
  );
};
const Performance = () => {
  let {
    network: networkName,
    api: polkadotApi,
    apiState: networkStatus,
    accounts,
    hasWeb3Injected,
  } = useContext(ApiContext);
  let { performanceCache, cachePerformance, isPerformanceCacheValid } =
    useContext(ManagementPageCacheContext);
  const [needRefetch, setNeedRefetch] = useState<INetworkReady>({
    kusama: true,
    polkadot: true,
  });
  const { width } = useWindowDimensions();

  const [accountsInfo, setAccountsInfo] = useState<IAccountsInfo>({} as IAccountsInfo);
  const [accountCache, setAccountCache] = useState<IAccount[]>([]);

  const currentNetworkLowerCase = useMemo(() => {
    return networkName.toLowerCase();
  }, [networkName]);

  const performanceContent = useMemo(() => {
    if (!hasWeb3Injected || accounts.length === 0) {
      return <Empty />;
    } else if (!needRefetch[currentNetworkLowerCase]) {
      return (
        <>
          <ProfitChartLayoutContainer>
            <ProfitChartLayout>
              <ProfitChart
                chain={networkName}
                accounts={accountsInfo.accounts}
                rewards={accountsInfo.rewards}
              />
            </ProfitChartLayout>
          </ProfitChartLayoutContainer>

          <PortfolioTable
            chain={networkName}
            accounts={accountsInfo.accounts}
            rewards={accountsInfo.rewards}
          />
        </>
      );
    } else {
      return <CustomScaleLoader />;
    }
  }, [
    accounts.length,
    accountsInfo.accounts,
    accountsInfo.rewards,
    currentNetworkLowerCase,
    hasWeb3Injected,
    needRefetch,
    networkName,
  ]);

  useEffect(() => {
    if (isPerformanceCacheValid(currentNetworkLowerCase)) {
      setAccountsInfo({
        accounts: performanceCache[currentNetworkLowerCase].accountsData,
        rewards: performanceCache[currentNetworkLowerCase].rewardsData,
      });
      setNeedRefetch((prev) => ({ ...prev, [currentNetworkLowerCase]: false }));
    } else {
      setNeedRefetch((prev) => ({ ...prev, [currentNetworkLowerCase]: true }));
    }
  }, [currentNetworkLowerCase, isPerformanceCacheValid, performanceCache]);

  useEffect(() => {
    setAccountCache(accounts);
  }, [accounts]);

  useEffect(() => {
    if (networkStatus === ApiState.READY && accountCache.length > 0 && needRefetch[currentNetworkLowerCase]) {
      const arr: IAccountChainInfo[] = [];
      const rewards: (IStashRewards | null)[] = [];
      const promises: Promise<any>[] = [];
      accountCache.forEach((account) => {
        if (hasValues(account) === true && networkStatus === ApiState.READY) {
          const promise = queryStakingInfo(account.address, polkadotApi)
            .then((info) => {
              arr.push(info);
            })
            .then(() => {
              return apiGetStashRewards({
                params: account.address,
                query: {
                  start: '2020-01-01',
                  end: moment().format('YYYY-MM-DD'),
                  currency: 'USD',
                  startBalance: 0.1,
                },
              })
                .then((reward) => {
                  rewards.push(reward);
                })
                .catch(() => {
                  rewards.push({
                    stash: account.address,
                    eraRewards: [],
                    totalInFiat: 0,
                  });
                });
            })
            .catch(console.error);
          promises.push(promise);
        }
      });
      Promise.all(promises).then(() => {
        cachePerformance(rewards, arr, currentNetworkLowerCase);
      });
    } else if (
      networkStatus !== ApiState.READY &&
      accountCache.length > 0 &&
      needRefetch[currentNetworkLowerCase]
    ) {
      setAccountCache([]);
    }
  }, [accountCache, cachePerformance, currentNetworkLowerCase, needRefetch, networkStatus, polkadotApi]);

  if (width > breakWidth.pad) {
    return (
      <CardHeader Header={() => <PerformanceHeader />} mainPadding="0 0 0 0">
        {performanceContent}
      </CardHeader>
    );
  } else {
    return (
      <CardHeaderFullWidth Header={() => <PerformanceHeader />} mainPadding="0 0 0 0">
        {performanceContent}
      </CardHeaderFullWidth>
    );
  }
};

export default Performance;

const HeaderLayout = styled.div`
  width: 1100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const HeaderTitle = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-left: 18px;
`;

const Title = styled.div`
  max-width: 800px;
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
`;

const Subtitle = styled.div`
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.55;
`;

const ProfitChartLayout = styled.div`
  height: 300px;
  width: 1100px;
`;

const ProfitChartLayoutContainer = styled.div`
  height: 300px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 16px;
  @media (max-width: 968px) {
    overflow-x: scroll;
  }
`;
