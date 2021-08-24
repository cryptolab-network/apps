import React, { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import Table from './Table';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { ApiContext, ApiState } from '../../../components/Api';
import { calcInflation, chainGetNominatorCounts, chainGetValidatorCounts, chainGetWaitingCount } from '../../../utils/Network';
import CustomScaleLoader from '../../../components/Spinner/ScaleLoader';
import Chart from '../../../components/Chart';
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
  'polkadot': [
    10000,
    100000,
    500000,
    1000000,
    20000000,
    50000000,
    100000000,
  ],
  'kusama': [
    1000,
    5000,
    10000,
    20000,
    30000,
    50000,
    100000,
  ]
};

const parseNominatorStakes = (network: string, decimals: number, nominators: INominatorInfo[]): IStake[] => {
  const stake: IStake[] = [];
  nominators.forEach(nominator => {
    let xaxis = SDCXAxis.polkadot;
    if (network === 'kusama') {
      xaxis = SDCXAxis.kusama;
    }
    console.log(nominator);
    for (let i = 1; i < xaxis.length; i++) {
      if ((nominator as any).balance.lockedBalance / decimals < xaxis[i]) {
        if (stake[i - 1] === undefined) {
          stake[i - 1] = {
            stakeRange: `${xaxis[i - 1]}`,
            count: 0,
          };
        }
        stake[i - 1].count++;
        break;
      }
    }
    for (let i = 0; i < stake.length; i++) {
      if (stake[i] === undefined) {
        stake[i] = {
          stakeRange: `${xaxis[i]}`,
          count: 0,
        }
      }
    }
  });
  return stake;
};

const StakeDistributionChart = () => {
  const { t } = useTranslation();
  let {
    network: networkName,
  } = useContext(ApiContext);
  const [stake, setStake] = useState<IStake[]>([]);
  const chain = NetworkConfig[networkName].token;
  useEffect(() => {
    const parseNominators = async () => {
      const nominators = await apiGetAllNominators({
        params: {
          chain: chain,
        },
      });
      const c = parseNominatorStakes(networkName, NetworkConfig[networkName].decimals, nominators);
      console.log(c);
      setStake(c);
    };
    parseNominators();
  }, [chain, networkName]);

  return (
    <StakeDistributionChartLayout>
      <SDCTitle>
        Stake Distrubution
      </SDCTitle>
      <ChartLayout>
        <Chart 
          data={stake}
          leftLabel={`Nominator Count`}
          config = {{
            xKey: 'stakeRange',
            firstDataKey: 'count',
            secondDataKey: undefined,
            thirdDataKey: undefined,
            firstDataYAxis: 'left',
            secondDataYAxis: undefined,
            thirdDataYAxis: undefined,
            leftLabel: `Nominator Count`,
            rightLabel: undefined,
          }}
        />
      </ChartLayout>
    </StakeDistributionChartLayout>
  );
};

const CDCXAxis = {
  'polkadot': [
    0,
    1,
    2,
    3,
    5,
    10,
    20,
    100
  ],
  'kusama': [
    0,
    1,
    2,
    3,
    5,
    10,
    20,
    100
  ]
};

interface ICommission {
  count: number;
  commission: string;
}

const parseValidatorCommissions = (network: string, validators: IValidator[]): ICommission[] => {
  const commissions: ICommission[] = [];
  validators.forEach(validator => {
    let xaxis = CDCXAxis.polkadot;
    if (network === 'kusama') {
      xaxis = CDCXAxis.kusama;
    }
    for (let i = 1; i < xaxis.length; i++) {
      if (validator.info.commission < xaxis[i]) {
        if (commissions[i - 1] === undefined) {
          commissions[i - 1] = {
            commission: `${xaxis[i - 1]} %`,
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
  let {
    network: networkName,
  } = useContext(ApiContext);
  const [commissions, setCommissions] = useState<ICommission[]>([]);
  const chain = NetworkConfig[networkName].token;
  useEffect(() => {
    const parseValidators = async () => {
      const validators = await apiGetAllValidator({
        params: chain,
        query: {},
      });
      const c = parseValidatorCommissions(networkName, validators);
      setCommissions(c);
    };
    parseValidators();
  }, [chain, networkName]);
  return (
    <CommissionDistributionChartLayout>
      <CDCTitle>
        Commission Distrubution
      </CDCTitle>
      <ChartLayout>
        <Chart 
          data={commissions}
          leftLabel={`Validator Count`}
          config = {{
            xKey: 'commission',
            firstDataKey: 'count',
            secondDataKey: undefined,
            thirdDataKey: undefined,
            firstDataYAxis: 'left',
            secondDataYAxis: undefined,
            thirdDataYAxis: undefined,
            leftLabel: `Validator Count`,
            rightLabel: undefined,
          }}
        />
      </ChartLayout>
    </CommissionDistributionChartLayout>
  );
};

const NetworkStatusTable = () => {
  const { t } = useTranslation();
  let {
    network: networkName,
    api: polkadotApi,
    apiState: networkStatus,
  } = useContext(ApiContext);
  const columns = useMemo(() => {
    return [
      {
        Header: t('benchmark.charts.table.header.network'),
        accessor: 'networkName',
        maxWidth: 180,
        Cell: ({ value }) => <span>{value}</span>,
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
        setNetworkData([{
          networkName: networkName,
          validatorCount: validatorCount,
          waitingCount: waitingCount,
          nominatorCount: nominatorCount,
          avgReturns: inflation.stakedReturned,
        }]);
      }
      toggleLoading(false);
    }
    getChainData();
  }, [networkName, networkStatus, nominatorCount, polkadotApi, validatorCount, waitingCount]);
  if (isLoading) {
    return (
      <CustomScaleLoader
      />
    );
  } else {
  return (
    <TableLayout>
      <Table
        columns={columns}
        data={networkData}
      />
    </TableLayout>
  );
  }
};

const Charts: React.FC = () => {
  return (
    <ChartsLayout>
      <ChartContent>
        <CommissionDistributionChart />
        <StakeDistributionChart />
      </ChartContent>
      <NetworkStatusTable />
    </ChartsLayout>
  );
}

export default Charts;

const ChartsLayout = styled.div`
  width: 70vw;
  height 70vh;
  border-radius: 8px;
  border: solid 1px #23beb9;
  background-color: #18232f;
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChartContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 90%;
`;

const TableLayout = styled.div`
  width: 50%;
  margin: 20px 5% 0 5%;
`;

const CommissionDistributionChartLayout = styled.div`
  width: 400px;
  height: 400px;
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
  height: 400px;
`;

const StakeDistributionChartLayout = styled.div`
  width: 400px;
  height: 400px;
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