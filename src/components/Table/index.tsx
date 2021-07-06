import styled from 'styled-components';
import { useTable, useExpanded, usePagination } from 'react-table';

type ICOLUMN = {
  columns: Array<any>;
  data: Array<any>;
};

const CustomTable: React.FC<ICOLUMN> = ({ columns: userColumns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { expanded, pageIndex, pageSize },
  } = useTable(
    {
      columns: userColumns,
      data,
    },
    useExpanded,
    usePagination // Use the useExpanded plugin hook
  );
  return (
    <Style>
      <div className="tableWrap">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps({
                          className: cell.column.collapse ? 'collapse' : '',
                        })}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <br />
      </div>
    </Style>
  );
};

export default CustomTable;

const Style = styled.div`
  display: block;
  width: 100%;

  .tableWrap {
    display: block;
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
  }

  table {
    width: 100%;
    border-spacing: 0;
    border: 0;

    tr {
      :last-child {
        td {
          border-bottom: 1px solid #404952;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 1rem;
      border-bottom: 1px solid #404952;
      border-right: 0;
      color: white;
      font-size: 13px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      width: 1%;
      text-align: center; /* But "collapsed" cells should be as small as possible */
      &.collapse {
        width: 0.0000000001%;
      }

      :last-child {
        border-right: 0;
      }
      :nth-child(2) {
        text-align: left;
      }
    }
  }
`;
