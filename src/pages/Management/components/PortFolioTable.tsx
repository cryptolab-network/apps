import moment from 'moment';
import { useEffect, useState, useContext } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IEraRewards, IStashRewards } from '../../../apis/StashRewards';
import Account from '../../../components/Account';
import { ApiContext } from '../../../components/Api';
import Table from '../../../components/Table';
import { NetworkConfig } from '../../../utils/constants/Network';
import { getAccountName } from '../../../utils/account';

interface TableContent {
  stash: string;
  staked: number;
  profit: number;
  totalInFiat: number;
  apy: number;
  fromDate: string;
  toDate: string;
}

const PortfolioTable = ({ chain, accounts, rewards }) => {
  const { accounts: walletAccounts } = useContext(ApiContext);
  const { t } = useTranslation();
  const [data, setTableData] = useState<TableContent[]>([]);
  const columns = useMemo(() => {
    return [
      {
        Header: t('pm.table.header.stash'),
        accessor: 'stash',
        maxWidth: 180,
        Cell: ({ value }) => (
          <span>{<Account address={value} display={getAccountName(value, walletAccounts)} />}</span>
        ),
      },
      {
        Header: t('pm.table.header.staked'),
        accessor: 'staked',
        maxWidth: 180,
        Cell: ({ value }) => (
          <span>
            {value} {NetworkConfig[chain].token}
          </span>
        ),
      },
      {
        Header: t('pm.table.header.profit'),
        accessor: 'profit',
        maxWidth: 180,
        Cell: ({ value, row }) => (
          <span>
            {value} {NetworkConfig[chain].token} ({row.original.fromDate} - {row.original.toDate})
          </span>
        ),
      },
      {
        Header: t('pm.table.header.totalInFiat'),
        accessor: 'totalInFiat',
        maxWidth: 180,
        Cell: ({ value }) => (
          <span>
            {value} {'USD'}
          </span>
        ),
      },
      {
        Header: t('pm.table.header.apy'),
        accessor: 'apy',
        maxWidth: 180,
        Cell: ({ value, row }) => <span>{value} % </span>,
      },
    ];
  }, [chain, t, walletAccounts]);
  useEffect(() => {
    const tableData = rewards.reduce((acc, reward: IStashRewards | null) => {
      if (reward !== null && reward.eraRewards.length === 0) {
        acc.push({
          stash: reward.stash,
          staked: 0,
          profit: 0,
          apy: '0',
          totalInFiat: '0',
          fromDate: '',
          toDate: '',
        });
      } else if (reward !== null) {
        const account = accounts.filter((account) => {
          return account.address === reward.stash;
        });
        const profit = reward.eraRewards.reduce((acc, reward: IEraRewards) => {
          acc += reward.amount;
          return acc;
        }, 0.0);
        const duration = moment(reward.eraRewards[0].timestamp).diff(
          moment(reward.eraRewards[reward.eraRewards.length - 1].timestamp),
          'days'
        );
        const staked = (
          parseInt(account[0].bonded, 16) / Math.pow(10, NetworkConfig[chain].decimals)
        ).toFixed(4);
        acc.push({
          stash: reward.stash,
          staked: staked,
          profit: profit.toFixed(4),
          apy: ((profit / parseFloat(staked)) * (365 / duration) * 100).toFixed(2),
          totalInFiat: reward.totalInFiat.toFixed(2),
          fromDate: moment(reward.eraRewards[reward.eraRewards.length - 1].timestamp).format('YYYY-MM-DD'),
          toDate: moment(reward.eraRewards[0].timestamp).format('YYYY-MM-DD'),
        });
      } else {
        // do nothing
      }
      return acc;
    }, []);
    tableData.sort((a, b) => {
      const compareA = Number(a.staked);
      const compareB = Number(b.staked);
      if (compareA > compareB) {
        return -1;
      } else if (compareA < compareB) {
        return 1;
      } else {
        return 0;
      }
    });
    setTableData(tableData);
  }, [accounts, chain, rewards]);
  return <Table columns={columns} data={data} />;
};

export default PortfolioTable;
