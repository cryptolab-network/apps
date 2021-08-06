import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as ActiveIcon } from '../../../../assets/images/active.svg';
import { ReactComponent as InactiveIcon } from '../../../../assets/images/inactive.svg';
import { ReactComponent as DashboardIcon } from '../../../../assets/images/dashboard.svg';
import styled from "styled-components";
import moment from "moment";
import { IOneKVValidator } from "../../../../apis/OneKV/validator";
import Table from "../../../../components/Table";
import { balanceUnit } from "../../../../utils/string";

const ValidatorTable = ({filter, chain, validators}) => {
  const history = useHistory();
  const onClickDashboard = useCallback((id: string) => {
    history.push(`/validator/${id}/${chain}`);
  }, [chain, history]);
  const _formatBalance = useCallback((value: any) => {
    return (<span>{balanceUnit(chain, value)}</span>);
  }, [chain]);
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
        Header: 'Commission',
        accessor: 'stakingInfo.validatorPrefs.commission',
        maxWidth: 48,
        Cell: ({ value }) => <span>{value / 10000000}%</span>,
      },
      {
        Header: 'Active',
        accessor: 'activeNominators',
        maxWidth: 60,
        Cell: ({ value }) => {
          if (value > 0) {
            return (<span><ActiveIcon /></span>);
          } else {
            return (<span><InactiveIcon /></span>);
          }
        },
      },
      {
        Header: '1KV nominated',
        accessor: 'elected',
        maxWidth: 100,
        Cell: ({ value, row }) => {
          if (value  === true) {
            return (<span><ActiveIcon /></span>);
          } else {
            return (
            <OneKVNominated>
              <InactiveIcon />
              <LastNominationDate>({moment(row.original.nominatedAt).format('MM/DD')})</LastNominationDate>
            </OneKVNominated>);
          }
        },
        sortType: 'basic',
      },
      {
        Header: 'Nomination Order',
        accessor: 'nominationOrder',
        maxWidth: 60,
        Cell: ({ value }) => {
          return (<span>{value}</span>);
        },
      },
      {
        Header: 'Self Stake',
        accessor: 'selfStake',
        maxWidth: 150,
        Cell: ({ value }) => {
          return (<span>{_formatBalance(value)}</span>);
        }
      },
      {
        Header: 'Rank',
        accessor: 'rank',
        maxWidth: 60,
        Cell: ({ value }) => {
          return (<span>{value}</span>);
        },
      },
      {
        Header: 'Inclusion',
        accessor: 'inclusion',
        maxWidth: 60,
        Cell: ({ value }) => {
          return (<span>{(value * 100).toFixed(2)}%</span>);
        },
        sortType: 'basic',
      },
    ]
  }, [_formatBalance, onClickDashboard]);
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
      pagination={true}
    />
  );
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
