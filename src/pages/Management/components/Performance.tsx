import styled from 'styled-components';
import CardHeader from '../../../components/Card/CardHeader';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { hasValues } from '../../../utils/helper';
import { IAccountChainInfo, queryStakingInfo } from '../../../utils/account';
import { ApiContext } from '../../../components/Api';
import { ApiState } from '../../../components/Api';
import { apiGetStashRewards, IStashRewards } from '../../../apis/StashRewards';
import moment from 'moment';
import CustomScaleLoader from '../../../components/Spinner/ScaleLoader';
import PortfolioTable from './PortFolioTable';
import ProfitChart from './ProfitCharts';

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
  let { network: networkName, api: polkadotApi, apiState: networkStatus, accounts } = useContext(ApiContext);
  const [isReady, setReady] = useState<boolean>(false);
  const [accountsChainInfo, setAccountsChainInfo] = useState<IAccountChainInfo[]>([]);
  const [accountsRewards, setAccountsRewards] = useState<(IStashRewards | null)[]>([]);

  useEffect(() => {
    if (accounts.length > 0 && !isReady) {
      const arr: IAccountChainInfo[] = [];
      const rewards: (IStashRewards | null)[] = [];
      const promises: Promise<any>[] = [];
      accounts.forEach((account) => {
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
                  rewards.push(null);
                });
            })
            .catch(console.error);
          promises.push(promise);
        }
      });
      Promise.all(promises).then(() => {
        setAccountsChainInfo(arr);
        setAccountsRewards(rewards);
        setReady(true);
      });
    }
  }, [accounts, isReady, networkStatus, polkadotApi]);
  if (isReady) {
    return (
      <CardHeader Header={() => <PerformanceHeader />}>
        <ProfitChartLayout>
          <ProfitChart chain={networkName} accounts={accountsChainInfo} rewards={accountsRewards} />
        </ProfitChartLayout>
        <PortfolioTable chain={networkName} accounts={accountsChainInfo} rewards={accountsRewards} />
      </CardHeader>
    );
  } else {
    return (
      <CardHeader Header={() => <PerformanceHeader />}>
        <CustomScaleLoader />
      </CardHeader>
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
