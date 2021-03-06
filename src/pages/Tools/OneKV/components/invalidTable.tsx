import styled from 'styled-components';
import { useTable, useExpanded, usePagination, useSortBy } from 'react-table';
import { tableType } from '../../../../utils/status/Table';
import Pagination from './invalidTablePagination';
import { ReactComponent as SortingDescIcon } from '../../../../assets/images/sorting-desc.svg';
import { ReactComponent as SortingAscIcon } from '../../../../assets/images/sorting-asc.svg';

type ICOLUMN = {
  columns: Array<any>;
  data: Array<any>;
  type?: tableType;
  pagination?: boolean;
  pgSize?: number;
};

const CustomTable: React.FC<ICOLUMN> = ({
  columns: userColumns,
  data,
  type = tableType.common,
  pagination = false,
  pgSize = 20,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    // pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    // setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: userColumns,
      data,
      initialState: { pageSize: pgSize },
    },
    useSortBy,
    useExpanded,
    usePagination // Use the useExpanded plugin hook,
  );
  return (
    <Style>
      <div className="tableWrap">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, j) => (
                  <th {...column.getSortByToggleProps()} key={j}>
                    {column.render('Header')}
                    <span key={j}>
                      {' '}
                      {'  '}
                      {column.isSorted ? column.isSortedDesc ? <SortingDescIcon /> : <SortingAscIcon /> : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={i}>
                  {type === tableType.stake && !row.canExpand && (
                    <>
                      <td colSpan={7}>{row.cells[4].render('Cell')}</td>
                    </>
                  )}
                  {type === tableType.stake &&
                    row.canExpand &&
                    row.cells.map((cell, idx) => {
                      return (
                        <td
                          style={{
                            borderBottom:
                              idx === 4 && row.isExpanded ? '2px solid #20aca8' : '1px solid #404952',
                          }}
                          {...cell.getCellProps()}
                          key={idx}
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  {type !== tableType.stake &&
                    row.cells.map((cell, idx) => {
                      return (
                        <td
                          style={{
                            borderBottom:
                              idx === 4 && row.isExpanded ? '2px solid #20aca8' : '1px solid #404952',
                          }}
                          {...cell.getCellProps()}
                          key={idx}
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
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {pagination ? (
          <Pagination
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            pageCount={pageCount}
            gotoPage={gotoPage}
            nextPage={nextPage}
            previousPage={previousPage}
            currentPage={pageIndex}
            firstItemIndex={pageSize * pageIndex + 1}
            lastItemIndex={Math.min(pageSize * pageIndex + pageSize, data.length)}
          />
        ) : null}
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
    height: 55vh;
    overflow-x: hidden;
    overflow-y: scroll;
    margin: 20px 0 0 0;
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
      /* width: 1%; */
      text-align: center;
      &.collapse {
        width: 0.0000000001%;
      }
      :last-child {
        border-right: 0;
      }
      :nth-child(2) {
        text-align: left;
        max-width: 250px;
      }
      :nth-child(3) {
        text-align: left;
        max-width: 250px;
      }
    }
  }
`;
