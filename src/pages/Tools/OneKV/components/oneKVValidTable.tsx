import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as ActiveIcon } from '../../../../assets/images/active.svg';
import { ReactComponent as InactiveIcon } from '../../../../assets/images/inactive.svg';
import { ReactComponent as DashboardIcon } from '../../../../assets/images/dashboard.svg';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { IOneKVValidator } from '../../../../apis/OneKV/validator';
import Table from '../../../../components/Table';
import { balanceUnit } from '../../../../utils/string';

import { useTranslation } from 'react-i18next';

const ValidatorTable = ({ chain, validators }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const onClickDashboard = useCallback(
    (id: string) => {
      history.push(`/validator/${id}/${chain}`);
    },
    [chain, history]
  );
  const _formatBalance = useCallback(
    (value: any) => {
      return <span>{balanceUnit(chain, value, true, true)}</span>;
    },
    [chain]
  );
  const columns = useMemo(() => {
    return [
      {
        Header: t('tools.oneKv.table.header.dashboard'),
        accessor: 'dashboard',
        maxWidth: 48,
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <span>
              <DashboardIcon
                onClick={() => {
                  onClickDashboard(row.original.stash);
                }}
              />
            </span>
          );
        },
      },
      {
        Header: t('tools.oneKv.table.header.name'),
        accessor: 'name',
        maxWidth: 180,
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        Header: t('tools.oneKv.table.header.commission'),
        accessor: 'stakingInfo.validatorPrefs.commission',
        maxWidth: 48,
        Cell: ({ value }) => <span>{value / 10000000}%</span>,
      },
      {
        Header: t('tools.oneKv.table.header.active'),
        accessor: 'activeNominators',
        maxWidth: 60,
        Cell: ({ value }) => {
          if (value > 0) {
            return (
              <span>
                <ActiveIcon />
              </span>
            );
          } else {
            return (
              <span>
                <InactiveIcon />
              </span>
            );
          }
        },
      },
      {
        Header: t('tools.oneKv.table.header.oneKvNominated'),
        accessor: 'elected',
        maxWidth: 100,
        Cell: ({ value, row }) => {
          if (value === true) {
            return (
              <span>
                <ActiveIcon />
              </span>
            );
          } else {
            return (
              <OneKVNominated>
                <InactiveIcon />
                <LastNominationDate>({dayjs(row.original.nominatedAt).format('MM/DD')})</LastNominationDate>
              </OneKVNominated>
            );
          }
        },
        sortType: 'basic',
      },
      {
        Header: t('tools.oneKv.table.header.nominationOrder'),
        accessor: 'nominationOrder',
        maxWidth: 60,
        Cell: ({ value }) => {
          return <span>{value}</span>;
        },
      },
      {
        Header: t('tools.oneKv.table.header.selfStake'),
        accessor: 'selfStake',
        maxWidth: 150,
        Cell: ({ value }) => {
          return <span>{_formatBalance(value)}</span>;
        },
      },
      {
        Header: t('tools.oneKv.table.header.rank'),
        accessor: 'rank',
        maxWidth: 60,
        Cell: ({ value }) => {
          return <span>{value}</span>;
        },
      },
      {
        Header: t('tools.oneKv.table.header.inclusion'),
        accessor: 'inclusion',
        maxWidth: 60,
        Cell: ({ value }) => {
          return <span>{(value * 100).toFixed(2)}%</span>;
        },
        sortType: 'basic',
      },
    ];
  }, [_formatBalance, onClickDashboard, t]);
  const [displayValidators, setDisplayValidators] = useState<IOneKVValidator[]>([]);
  useEffect(() => {
    setDisplayValidators(validators);
  }, [chain, validators]);

  return <Table columns={columns} data={displayValidators} pagination={true} />;
};

export default ValidatorTable;

const OneKVNominated = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const LastNominationDate = styled.div`
  margin: 0 0 0 4px;
  justify-content: center;
  align-items: center;
`;
