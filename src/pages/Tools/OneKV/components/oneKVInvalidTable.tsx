import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as DashboardIcon } from '../../../../assets/images/dashboard.svg';
import styled from "styled-components";
import { IOneKVValidator } from "../../../../apis/OneKV/validator";
import Table from "../../../../components/Table";

const InvalidValidatorTable = ({filter, chain, validators}) => {
  const history = useHistory();
  const onClickDashboard = useCallback((id: string) => {
    history.push(`/tools/validator/${id}/${chain}`);
  }, [chain, history]);

  const columns = useMemo(() => {
    return [
      {
        Header: 'Dashboard',
        accessor: 'dashboard',
        maxWidth: 48,
        disableSortBy: true,
        Cell: ( {row} ) => {
          return(<span><DashboardIcon 
            onClick={() => {onClickDashboard(row.original.stash)}}/></span>);
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
        maxWidth: 180,
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        Header: 'Reasons',
        accessor: 'validity',
        maxWidth: 180,
        Cell: ({ value }) => {
          const reasons = value.reduce((acc, r) => {
            if (r.valid === false) {
              acc.push(r.details);
            }
            return acc;
          }, []);
          let components = reasons.map((reason) => {
            return (<li>{reason}</li>);
          });
          if(components.length === 0) {
            components = (<div></div>);
          }
          return (
            <span style={{textAlign: 'left'}}>{components}
            </span>);
        },
      },
    ]
  }, [onClickDashboard]);
  const [displayValidators, setDisplayValidators] = useState<IOneKVValidator[]>([]);
  useEffect(() => {
    setDisplayValidators(validators);
  }, [chain, validators]);
  useMemo(() => {
    if (filter.stashId.length > 0) {
      const displayValidators: IOneKVValidator[] = [];
      validators.forEach((v) => {
        if (v.stash.toLowerCase().includes(filter.stashId.toLowerCase())) {
          displayValidators.push(v);
        } else if(v.name.toLowerCase().includes(filter.stashId.toLowerCase())) {
          displayValidators.push(v);
        }
      });
      setDisplayValidators(displayValidators);
    } else {
      setDisplayValidators(validators);
    }
  }, [filter.stashId, validators]);
  return (
    <Table
      columns={columns}
      data={displayValidators}
    />
  );
};

export default InvalidValidatorTable;

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
