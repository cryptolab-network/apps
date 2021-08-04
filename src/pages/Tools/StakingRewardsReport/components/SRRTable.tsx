import moment from "moment";
import { useMemo } from "react";
import styled from "styled-components";
import Table from "../../../../components/Table";

const SRRTable = ( {stashData, currency} ) => {
  const columns = useMemo(() => {
    return [
      {
        Header: 'Payout Date',
        accessor: 'timestamp',
        width: 180,
        minWidth: 180,
        maxWidth: 180,
        Cell: ({ value }) => <span>{moment(value).format('YYYY-MM-DD')}</span>,
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        maxWidth: 100,
        minWidth: 100,
        width: 100,
        Cell: ({ value }) => <span>{value.toFixed(4)}</span>,
      },
      {
        Header: `Price (${currency})`,
        accessor: 'price',
        maxWidth: 100,
        width: 100,
        Cell: ({ value }) => <span>{value.toFixed(2)}</span>,
      },
      {
        Header: `Total (${currency})`,
        accessor: 'total',
        maxWidth: 100,
        width: 100,
        Cell: ({ value }) => <span>{value.toFixed(2)}</span>,
      },
    ];
  }, [currency]);
  return (
    <SRRTableLayout>
      <Table
        columns={columns}
        data={stashData}
        pagination
        pgSize={10}
      />
    </SRRTableLayout>
  );
};

export default SRRTable;

const SRRTableLayout = styled.div`
  margin: 9.6px 0 10.1px 0;
  padding: 13px 0 18.4px 0;
  border-radius: 6px;
  background-color: rgba(35, 190, 185, 0.1);
`;