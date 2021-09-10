import React, { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import Table from './Table/chart';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { ApiContext, ApiState } from '../../../components/Api';
import {
  calcInflation,
  chainGetNominatorCounts,
  chainGetValidatorCounts,
  chainGetWaitingCount,
} from '../../../utils/Network';
import { ReactComponent as KSMLogo } from '../../../assets/images/ksm-logo.svg';
import { ReactComponent as DOTLogo } from '../../../assets/images/dot-logo.svg';
import { ReactComponent as WNDLogo } from '../../../assets/images/wnd-logo.svg';
import CustomScaleLoader from '../../../components/Spinner/ScaleLoader';
import BarChart from '../../../components/Chart/bar';
import { apiGetAllValidator, IValidator } from '../../../apis/Validator';
import { NetworkConfig } from '../../../utils/constants/Network';
import { apiGetAllNominators, INominatorInfo } from '../../../apis/Nominator';

interface INetworkData {
  networkName: string;
  validatorCount: number;
  waitingCount: number;
  nominatorCount: number;
  avgReturns: number;
}

interface IStake {
  count: number;
  stakeRange: string;
}

const SDCXAxis = {
  polkadot: [100, 500, 1000, 10000, 100000, 500000, 1000000, 20000000, 50000000],
  kusama: [1, 10, 100, 500, 1000, 2000, 3000, 10000, 100000],
  polkadotTitle: ['<=100', '<=500', '<=1k', '<=10k', '<=100k', '<=500k', '<=1M', '<=2M', '>2M'],
  kusamaTitle: ['<=1', '<=10', '<=100', '<=500', '<=1k', '<=2k', '<=3k', '<=10k', '>10k'],
};

const parseNominatorStakes = (network: string, decimals: number, nominators: INominatorInfo[]): IStake[] => {
  const stake: IStake[] = [];
  nominators.forEach((nominator) => {
    let xaxis = SDCXAxis.polkadot;
    let xaxisTitle = SDCXAxis.polkadotTitle;
    if (network === 'Kusama') {
      xaxis = SDCXAxis.kusama;
      xaxisTitle = SDCXAxis.kusamaTitle;
    }
    for (let i = 0; i < xaxis.length; i++) {
      if ((nominator as any).balance.lockedBalance / Math.pow(10, decimals) <= xaxis[i]) {
        if (stake[i] === undefined) {
          stake[i] = {
            stakeRange: `${xaxisTitle[i]}`,
            count: 0,
          };
        }
        stake[i].count++;
        break;
      }
      if (i === xaxis.length - 1) {
        if (stake[i] === undefined) {
          stake[i] = {
            stakeRange: `${xaxisTitle[i]}`,
            count: 0,
          };
        }
        stake[i].count++;
        break;
      }
    }

    for (let i = 0; i < stake.length; i++) {
      if (stake[i] === undefined) {
        stake[i] = {
          stakeRange: `${xaxisTitle[i]}`,
          count: 0,
        };
      }
    }
  });
  return stake;
};

const StakeDistributionChart = () => {
  const { t } = useTranslation();
  let { network: networkName, nominatorCache, cacheNominators } = useContext(ApiContext);
  const [stake, setStake] = useState<IStake[]>([]);
  const chain = NetworkConfig[networkName].token;
  useEffect(() => {
    const parseNominators = async () => {

      let nominators;
      const now = Math.floor(+new Date());
      if (nominatorCache.nominators !== null && nominatorCache.expireTime !== null && nominatorCache.expireTime > now) {
        nominators = nominatorCache.nominators;
      } else {
        nominators = await apiGetAllNominators({
          params: {
            chain: chain,
          },
        });
        cacheNominators(nominators);
      }
      const c = parseNominatorStakes(networkName, NetworkConfig[networkName].decimals, nominators);
      setStake(c);
    };
    parseNominators();
  }, [chain, networkName, nominatorCache, cacheNominators]);

  return (
    <StakeDistributionChartLayout>
      <SDCTitle>{t('benchmark.charts.sd.title')}</SDCTitle>
      <ChartLayout>
        <BarChart
          data={stake}
          leftLabel={t('benchmark.charts.sd.nominatorCount')}
          xAxisHeight={80}
          config={{
            xKey: 'stakeRange',
            firstDataKey: 'count',
            secondDataKey: undefined,
            thirdDataKey: undefined,
            firstDataYAxis: 'left',
            secondDataYAxis: undefined,
            thirdDataYAxis: undefined,
            leftLabel: t('benchmark.charts.sd.nominatorCount'),
            rightLabel: undefined,
          }}
        />
      </ChartLayout>
    </StakeDistributionChartLayout>
  );
};

const CDCXAxis = {
  polkadot: [0, 1, 2, 3, 5, 10, 20, 100],
  kusama: [0, 1, 2, 3, 5, 10, 20, 100],
  polkadotTitle: ['<1%', '1%', '2%', '3%', '5%', '10%', '20%', '>20%'],
  kusamaTitle: ['<1%', '1%', '2%', '3%', '5%', '10%', '20%', '>20%'],
};

interface ICommission {
  count: number;
  commission: string;
}

const parseValidatorCommissions = (network: string, validators: IValidator[]): ICommission[] => {
  const commissions: ICommission[] = [];
  validators.forEach((validator) => {
    let xaxis = CDCXAxis.polkadot;
    let xaxisTitle = CDCXAxis.polkadotTitle;
    if (network === 'Kusama') {
      xaxis = CDCXAxis.kusama;
      xaxisTitle = CDCXAxis.kusamaTitle;
    }
    for (let i = 1; i <= xaxis.length; i++) {
      let c = validator.info.commission;
      if (c < 0.01) {
        c = 0;
      }
      if (c <= xaxis[i - 1]) {
        if (commissions[i - 1] === undefined) {
          commissions[i - 1] = {
            commission: `${xaxisTitle[i - 1]}`,
            count: 0,
          };
        }
        commissions[i - 1].count++;
        break;
      }
    }
  });
  return commissions;
};

const CommissionDistributionChart = () => {
  const { t } = useTranslation();
  let { network: networkName, validatorCache, cacheValidators } = useContext(ApiContext);
  const [commissions, setCommissions] = useState<ICommission[]>([]);
  const chain = NetworkConfig[networkName].token;
  useEffect(() => {
    const parseValidators = async () => {
      let validators;
      const now = Math.floor(+new Date());

      if (validatorCache.validators !== null && validatorCache.expireTime !== null && validatorCache.expireTime > now) {
        validators = validatorCache.validators;
      } else {
        validators = await apiGetAllValidator({
          params: chain,
          query: {},
        });
        cacheValidators(validators);
      }
      const c = parseValidatorCommissions(networkName, validators);
      setCommissions(c);
    };
    parseValidators();
  }, [chain, networkName, validatorCache, cacheValidators]);
  return (
    <CommissionDistributionChartLayout>
      <CDCTitle>{t('benchmark.charts.cd.title')}</CDCTitle>
      <ChartLayout>
        <BarChart
          data={commissions}
          leftLabel={t('benchmark.charts.cd.validatorCount')}
          xAxisHeight={80}
          xAxisFontSize={12}
          legendPayload={[{ value: t('benchmark.charts.cd.validatorCount') }]}
          config={{
            xKey: 'commission',
            firstDataKey: 'count',
            secondDataKey: undefined,
            thirdDataKey: undefined,
            firstDataYAxis: 'left',
            secondDataYAxis: undefined,
            thirdDataYAxis: undefined,
            leftLabel: t('benchmark.charts.cd.validatorCount'),
            rightLabel: undefined,
          }}
        />
      </ChartLayout>
    </CommissionDistributionChartLayout>
  );
};

const getLogoDiv = (network) => {
  switch (network) {
    case 'Kusama':
      return <KSMLogo style={{ width: 36, height: 36 }} />;
    case 'Polkadot':
      return <DOTLogo style={{ width: 36, height: 36 }} />;
    case 'Westend':
      return <WNDLogo style={{ width: 36, height: 36 }} />;
  }
};

const NetworkStatusTable = () => {
  const { t } = useTranslation();
  let { network: networkName, api: polkadotApi, apiState: networkStatus } = useContext(ApiContext);
  const columns = useMemo(() => {
    return [
      {
        Header: t('benchmark.charts.table.header.network'),
        accessor: 'networkName',
        width: 360,
        Cell: ({ value }) => (
          <span style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            {getLogoDiv(value)}
            <NetworkTitle>{value}</NetworkTitle>
          </span>
        ),
      },
      {
        Header: t('benchmark.charts.table.header.validators'),
        accessor: 'validatorCount',
        maxWidth: 180,
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        Header: t('benchmark.charts.table.header.waiting'),
        accessor: 'waitingCount',
        maxWidth: 180,
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        Header: t('benchmark.charts.table.header.nominators'),
        accessor: 'nominatorCount',
        maxWidth: 180,
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        Header: t('benchmark.charts.table.header.averageReturns'),
        accessor: 'avgReturns',
        maxWidth: 180,
        Cell: ({ value }) => <span>{value.toFixed(2)} %</span>,
      },
    ];
  }, [t]);

  const [validatorCount, setValidatorCount] = useState<number>(0);
  const [waitingCount, setWaitingCount] = useState<number>(0);
  const [nominatorCount, setNominatorCount] = useState<number>(0);
  const [networkData, setNetworkData] = useState<INetworkData[]>([]);
  const [isLoading, toggleLoading] = useState<boolean>(false);
  useEffect(() => {
    async function getChainData() {
      toggleLoading(true);
      if (networkStatus === ApiState.READY) {
        let c = await chainGetValidatorCounts(networkName, polkadotApi);
        setValidatorCount(c);
        c = await chainGetNominatorCounts(networkName, polkadotApi);
        setNominatorCount(c);
        c = await chainGetWaitingCount(networkName, polkadotApi);
        setWaitingCount(c);
        const inflation = await calcInflation(networkName, polkadotApi);
        setNetworkData([
          {
            networkName: networkName,
            validatorCount: validatorCount,
            waitingCount: waitingCount,
            nominatorCount: nominatorCount,
            avgReturns: inflation.stakedReturned,
          },
        ]);
      }
      toggleLoading(false);
    }
    getChainData();
  }, [networkName, networkStatus, nominatorCount, polkadotApi, validatorCount, waitingCount]);
  if (isLoading) {
    return <CustomScaleLoader />;
  } else {
    return (
      <TableLayout>
        <Table columns={columns} data={networkData} />
      </TableLayout>
    );
  }
};

const Charts: React.FC = () => {
  return (
    <ChartsLayout>
      <ChartRow>
        <ChartItem>
          <CommissionDistributionChart />
        </ChartItem>
        <ChartItem>
          <StakeDistributionChart />
        </ChartItem>
      </ChartRow>
      <div style={{ boxSizing: 'border-box', width: '100%', padding: '4px' }}>
        <NetworkStatusTable />
      </div>
    </ChartsLayout>
  );
};

export default Charts;

const ChartsLayout = styled.div`
  box-sizing: border-box;
  min-width: 1260px;
  /* height: 70vh; */
  border-radius: 8px;
  border: solid 1px #23beb9;
  background-color: #18232f;
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px;
  @media (max-width: 1395px) {
    width: 95vw;
  }
`;

const ChartRow = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  /* padding: 4px; */
  margin: 8px 0px 0px 0px;
  @media (max-width: 1395px) {
    flex-direction: column;
  }
`;

const ChartItem = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  @media (max-width: 1395px) {
    width: 100%;
  }
`;

const TableLayout = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 4px 16px 4px 16px;
  border-radius: 6px;
  background-color: #2f3842;
`;

const CommissionDistributionChartLayout = styled.div`
  width: 100%;
  height: 100%;
`;

const CDCTitle = styled.div`
  font-family: Montserrat;
  font-size: 15px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.27;
  letter-spacing: normal;
  text-align: left;
  color: white;
`;

const ChartLayout = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 478px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background-color: #2f3842;
  margin-top: 14px;
  padding: 6px;
`;

const StakeDistributionChartLayout = styled.div`
  width: 100%;
  height: 100%;
`;

const SDCTitle = styled.div`
  font-family: Montserrat;
  font-size: 15px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.27;
  letter-spacing: normal;
  text-align: left;
  color: white;
`;

const NetworkTitle = styled.div`
  margin-left: 8px;
  margin-right: 8px;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  color: white;
  flex-grow: 1;
`;
