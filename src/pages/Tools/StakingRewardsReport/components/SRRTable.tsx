import dayjs from 'dayjs';
import { useMemo } from 'react';
import styled from 'styled-components';
import Table from '../../../../components/Table';

import { useTranslation } from 'react-i18next';

const SRRTable = ({ stashData, currency }) => {
  const { t } = useTranslation();
  const columns = useMemo(() => {
    return [
      {
        Header: t('tools.stakingRewards.table.header.payoutDate'),
        accessor: 'timestamp',
        width: 180,
        minWidth: 180,
        maxWidth: 180,
        Cell: ({ value }) => {
          return <span>{dayjs(value).format('YYYY-MM-DD')}</span>;
        },
      },
      {
        Header: t('tools.stakingRewards.table.header.amount'),
        accessor: 'amount',
        maxWidth: 100,
        minWidth: 100,
        width: 100,
        Cell: ({ value }) => <span>{value.toFixed(4)}</span>,
      },
      {
        Header: `${t('tools.stakingRewards.table.header.price')} (${currency})`,
        accessor: 'price',
        maxWidth: 100,
        width: 100,
        Cell: ({ value }) => <span>{value.toFixed(2)}</span>,
      },
      {
        Header: `${t('tools.stakingRewards.table.header.total')} (${currency})`,
        accessor: 'total',
        maxWidth: 100,
        width: 100,
        Cell: ({ value }) => {
          if (value !== undefined) {
            if (typeof value !== 'string') {
              return <span>{value.toFixed(2)}</span>;
            } else {
              return <span>{value}</span>;
            }
          } else {
            return <span></span>;
          }
        },
      },
    ];
  }, [currency, t]);
  return (
    <SRRTableLayout>
      <Table columns={columns} data={stashData} pagination pgSize={10} />
    </SRRTableLayout>
  );
};

export default SRRTable;

const SRRTableLayout = styled.div`
  width: 100%;
  /* margin: 9.6px 0 10.1px 0;
  padding: 13px 0 18.4px 0;
  border-radius: 6px; */
`;
