import styled from 'styled-components';
import { useTable, useExpanded, usePagination, useSortBy } from 'react-table';
import { tableType } from '../../../../utils/status/Table';
import Pagination from './comopnents/Pagination';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type ICOLUMN = {
  columns: Array<any>;
  data: Array<any>;
  type?: tableType;
  pagination?: boolean;
  customPageSize?: number;
};

const CustomTable: React.FC<ICOLUMN> = ({
  columns: userColumns,
  data,
  type = tableType.common,
  pagination = false,
  customPageSize = 20,
}) => {
  const { t } = useTranslation();

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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: userColumns,
      data,
      initialState: { pageSize: customPageSize },
    },
    useSortBy,
    useExpanded,
    usePagination // Use the useExpanded plugin hook
  );

  useEffect(() => {
    setPageSize(customPageSize);
  }, [customPageSize, setPageSize]);

  const commissionHeaderName = useMemo(() => {
    return t('benchmark.staking.table.header.commission') + ' %';
  }, [t]);

  return (
    <Style>
      <div className="tableWrap">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  if (typeof column.Header === 'string' && column.Header !== commissionHeaderName) {
                    return (
                      <th {...column.getSortByToggleProps()}>
                        {column.render('Header')}
                        <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                      </th>
                    );
                  } else {
                    return <th>{column.render('Header')}</th>;
                  }
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {type === tableType.stake && !row.canExpand && (
                    <>
                      <td colSpan={8}>{row.cells[4].render('Cell')}</td>
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
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {pagination ? (
          <Pagination
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            pageOptions={pageOptions}
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
      text-align: center;
      &.collapse {
        width: 0.0000000001%;
      }
      :first-child {
        width: 0.00001%;
      }
      :last-child {
        border-right: 0;
      }
      :nth-child(2) {
        text-align: left;
        max-width: 250px;
      }
    }
  }
`;
