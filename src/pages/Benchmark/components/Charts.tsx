import React, { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import Table from './Table';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { ApiContext, ApiState } from '../../../components/Api';
import { calcInflation, chainGetNominatorCounts, chainGetValidatorCounts, chainGetWaitingCount } from '../../../utils/Network';

interface INetworkData {
  networkName: string;
  validatorCount: number;
  waitingCount: number;
  nominatorCount: number;
  avgReturns: number;
}

const NetworkStatusTable = () => {
  const { t } = useTranslation();
  let {
    network: networkName,
    api: polkadotApi,
    apiState: networkStatus,
    selectedAccount,
    refreshAccountData,
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
  const [networkData, setNetworkData] = useState<INetworkData[]>([])
  useEffect(() => {
    async function getChainData() {
      if (networkStatus === ApiState.READY) {
        let c = await chainGetValidatorCounts(networkName, polkadotApi);
        setValidatorCount(c);
        c = await chainGetNominatorCounts(networkName, polkadotApi);
        setNominatorCount(c);
        c = await chainGetWaitingCount(networkName, polkadotApi);
        setWaitingCount(c);
        const inflation = await calcInflation(networkName, polkadotApi);
        console.log(inflation);
        setNetworkData([{
          networkName: networkName,
          validatorCount: validatorCount,
          waitingCount: waitingCount,
          nominatorCount: nominatorCount,
          avgReturns: inflation.stakedReturned,
        }]);
      }
    }
    getChainData();
  }, [networkName, networkStatus, nominatorCount, polkadotApi, validatorCount, waitingCount]);

  return (
    <TableLayout>
      <Table
        columns={columns}
        data={networkData}
      />
    </TableLayout>
  );
};

const Charts: React.FC = () => {
  return (
    <ChartsLayout>
      <ChartContent>

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
  flex-direction: row;
  align-items: center;
`;

const ChartContent = styled.div`
  display: flex;
  flex-direction: column;

`;

const TableLayout = styled.div`
  width: 90%;
  margin: 20px 5% 0 5%;
`;