import moment from "moment";
import { useEffect, useState } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IEraRewards, IStashRewards } from "../../../apis/StashRewards";
import Account from "../../../components/Account";
import Table from "../../../components/Table";
import { NetworkConfig } from "../../../utils/constants/Network";
import { shortenStashId } from "../../../utils/string";

interface TableContent {
  stash: string,
  staked: number,
  profit: number,
  totalInFiat: number,
  apy: number,
  fromDate: string,
  toDate: string,
}

const PortfolioTable = ({chain, accounts, rewards}) => {
  const { t } = useTranslation();
  const [data, setTableData] = useState<TableContent[]>([]);
  const columns = useMemo(() => {
    return [
      {
        Header: t('pm.table.header.stash'),
        accessor: 'stash',
        maxWidth: 180,
        Cell: ({ value }) => <span>{<Account address={value} display={shortenStashId(value)}/>}</span>,
      },
      {
        Header: t('pm.table.header.staked'),
        accessor: 'staked',
        maxWidth: 180,
        Cell: ({ value }) => <span>{value} {NetworkConfig[chain].token}</span>,
      },
      {
        Header: t('pm.table.header.profit'),
        accessor: 'profit',
        maxWidth: 180,
        Cell: ({ value, row }) => <span>{value} {NetworkConfig[chain].token} ({row.original.fromDate} - {row.original.toDate})</span>,
      },
      {
        Header: t('pm.table.header.totalInFiat'),
        accessor: 'totalInFiat',
        maxWidth: 180,
        Cell: ({ value }) => <span>{value} {'USD'}</span>,
      },
      {
        Header: t('pm.table.header.apy'),
        accessor: 'apy',
        maxWidth: 180,
        Cell: ({ value, row }) => <span>{value} % </span>,
      }
    ];
  }, [chain, t]);
  useEffect(() => {
    const tableData = rewards.reduce((acc, reward: IStashRewards | null) => {
      if (reward !== null) {
        const account = accounts.filter((account) => {
          return account.address === reward.stash;
        });
        const profit = reward.eraRewards.reduce((acc, reward: IEraRewards) => {
          acc += reward.amount;
          return acc;
        }, 0.0);
        const duration = moment(reward.eraRewards[0].timestamp).diff(moment(reward.eraRewards[reward.eraRewards.length - 1].timestamp), 'days');
        console.log(`duration: ${duration} days`);
        acc.push({
          stash: reward.stash,
          staked: (parseInt(account[0].bonded, 16) / Math.pow(10, NetworkConfig[chain].decimals)).toFixed(4),
          profit: profit.toFixed(4),
          apy: ((profit / duration) * 100).toFixed(2),
          totalInFiat: reward.totalInFiat.toFixed(2),
          fromDate: moment(reward.eraRewards[reward.eraRewards.length - 1].timestamp).format('YYYY-MM-DD'),
          toDate: moment(reward.eraRewards[0].timestamp).format('YYYY-MM-DD'),
        });
      }
      return acc;
    }, []);
    setTableData(tableData);
  }, [accounts, chain, rewards]);
  console.log(data);
  return (
    <Table 
      columns={columns}
      data={data}
    />
  );
};

export default PortfolioTable;