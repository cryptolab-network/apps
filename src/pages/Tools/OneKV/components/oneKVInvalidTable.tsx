import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as DashboardIcon } from '../../../../assets/images/dashboard.svg';
import { IOneKVValidator } from '../../../../apis/OneKV/validator';
import Table from './invalidTable';
import { useTranslation } from 'react-i18next';
const InvalidValidatorTable = ({ chain, validators }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const onClickDashboard = useCallback(
    (id: string) => {
      history.push(`/validator/${id}/${chain}`);
    },
    [chain, history]
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
            <span key={row.original.stash}>
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
        Cell: ({ value }) => <span key={value}>{value}</span>,
      },
      {
        Header: t('tools.oneKv.table.header.reasons'),
        accessor: 'reasons',
        maxWidth: 180,
        Cell: ({ value }) => {
          let components = value.map((reason, i) => {
            return <li key={i}>{reason}</li>;
          });
          if (components.length === 0) {
            components = <div></div>;
          }
          return (
            <span style={{ textAlign: 'left' }} key={value}>
              {components}
            </span>
          );
        },
      },
    ];
  }, [onClickDashboard, t]);
  const [displayValidators, setDisplayValidators] = useState<IOneKVValidator[]>([]);
  useEffect(() => {
    setDisplayValidators(validators);
  }, [chain, validators]);
  return <Table columns={columns} data={displayValidators} />;
};

export default InvalidValidatorTable;
