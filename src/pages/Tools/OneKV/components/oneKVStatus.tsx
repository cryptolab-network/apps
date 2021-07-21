import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as DashboardIcon } from '../../../../assets/images/dashboard.svg';
import { ReactComponent as MonitorIcon } from '../../../../assets/images/monitor.svg';
import { ReactComponent as Search } from '../../../../assets/images/search.svg';
import { ReactComponent as ActiveIcon } from '../../../../assets/images/active.svg';
import { ReactComponent as InactiveIcon } from '../../../../assets/images/inactive.svg';
import CardHeader from '../../../../components/Card/CardHeader';
import IconInput from '../../../../components/Input/IconInput';
import Table from '../../../../components/Table';
import { useAppSelector } from '../../../../hooks';
import { formatBalance } from '@polkadot/util';
import { apiGetAllOneKVValidator, IOneKVValidator, IOneKVValidators } from '../../../../apis/OneKV/validator';
import { useHistory } from 'react-router-dom';
import { apiGetOneKVNominators, IOneKVNominators } from '../../../../apis/OneKV/nominator';

const OneKVHeader = () => {
  return (
    <HeaderLayout>
      <HeaderLeft>
        <MonitorIcon />
        <HeaderTitle>
          <Title>One Thousand Validator Monitor</Title>
          <Subtitle>Nomination order and data of all One Thousand Validators</Subtitle>
        </HeaderTitle>
      </HeaderLeft>
    </HeaderLayout>
  );
};

const ValidatorTable = () => {
  const history = useHistory();
  const networkName = useAppSelector(state => state.network.name);
  const chain = (networkName === 'Polkadot') ? "DOT" : "KSM";
  const _formatBalance = useCallback((value: any) => {
    if (chain === 'KSM') {
      return (<span>{formatBalance(value, {
        decimals: 12,
        withUnit: 'KSM'
      })}</span>);
    } else if (chain === 'DOT') {
      return (<span>{formatBalance(value, {
        decimals: 10,
        withUnit: 'DOT'
      })}</span>);
    }
  }, [chain]);
  const onClickDashboard = useCallback((id: string) => {
    history.push(`/tools/validator/${id}/${chain}`);
  }, [chain, history]);
  const columns = useMemo(() => {
    return [
      {
        Header: 'Dashboard',
        accessor: 'dashboard',
        maxWidth: 48,
        Cell: ( {row} ) => {
          return(<span><DashboardIcon 
            onClick={() => {onClickDashboard(row.values.stash)}}/></span>);
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
        maxWidth: 60,
        Cell: ({ value }) => {
          if (value  === true) {
            return (<span><ActiveIcon /></span>);
          } else {
            return (<span><InactiveIcon /></span>);
          }
        },
      },
      {
        Header: 'Nomination Order',
        accessor: 'stash',
        maxWidth: 60,
        Cell: ({ value, row }) => {
          return (<span>{row.index + 1}</span>);
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
      },
    ]
  }, [_formatBalance, onClickDashboard]);
  const [validators, setValidators] = useState<IOneKVValidator[]>([]);
  useEffect(() => {
    const mergeOneKVData = (oneKV: IOneKVValidators, oneKVNominators: IOneKVNominators) => {
      oneKV.valid = oneKV.valid.map((v) => {
        v.elected = false;
        // eslint-disable-next-line array-callback-return
        oneKVNominators.nominators.map((n) => {
          // eslint-disable-next-line array-callback-return
          n.current.map((p) => {
            if (p.stash === v.stash) {
              v.elected = true;
            }
          });
        });
        return v;
      });
      return oneKV;
    };
    async function getValidators() {
      try {
        let oneKV = await apiGetAllOneKVValidator({ params: chain});
        const oneKVNominators = await apiGetOneKVNominators({ params: chain });
        oneKV = mergeOneKVData(oneKV, oneKVNominators);
        setValidators(oneKV.valid);
      } catch (err) {
        console.error(err);
      }
    };
    getValidators();
  }, [chain]);
  return (
    <Table
      columns={columns}
      data={validators}
    />
  );
};

const ValNomContent = () => {
  const [filters, setFilters] = useState({
    stashId: '',
  });
  const handleFilterChange = (name) => (e) => {
    // TODO: input validator, limit
    switch (name) {
      case 'stashId':
        setFilters((prev) => ({ ...prev, stashId: e.target.value }));
        break;
      default:
        break;
    }
  };
  return (
    <div>
      <OptionBar>
        <IconInput
          Icon={Search}
          iconSize="16px"
          placeholder="Polkadot/Kusama StashId"
          inputLength={256}
          value={filters.stashId}
          onChange={handleFilterChange('stashId')}
        />
      </OptionBar>
      <ValidatorTable />
    </div>
  );
};

export const OneKVStatus = () => {
  return (
    <CardHeader
      Header={() => (
        <OneKVHeader/>
      )}
    >
      <ValNomContent/>
    </CardHeader>
  );
};

const HeaderLayout = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const HeaderTitle = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-left: 18px;
`;

const Title = styled.div`
  width: 800px;
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
`;

const Subtitle = styled.div`
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.55;
`;

const OptionBar = styled.div`
  width: 100%;
  height: 62px;
  padding: 12px 0px 0px 13.8px;
  border-radius: 6px;
  background-color: #2f3842;
`;