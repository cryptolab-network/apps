import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
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

const ValidatorTable = ({filter, chain, validators}) => {
  const history = useHistory();
  const onClickDashboard = useCallback((id: string) => {
    history.push(`/tools/validator/${id}/${chain}`);
  }, [chain, history]);
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
            console.log(row);
            return (
            <OneKVNominated>
              <InactiveIcon />
              <LastNominationDate>({moment(row.original.nominatedAt).format('MM/DD')})</LastNominationDate>
            </OneKVNominated>);
          }
        },
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
    />
  );
};

const ValNomContent = () => {
  const networkName = useAppSelector(state => state.network.name);
  const chain = (networkName === 'Polkadot') ? "DOT" : "KSM";
  
  const [validators, setValidators] = useState<IOneKVValidator[]>([]);
  const [activeEra, setActiveEra] = useState<number>(0);
  const [validValidators, setValidValidators] = useState<number>(0);
  const [activeValidators, setActiveValidators] = useState<number>(0);
  const [electedValidators, setElectedValidators] = useState<number>(0);
  const [lastUpdatedTime, setlastUpdatedTime] = useState<string>('N/A');
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
        setActiveEra(oneKV.activeEra);
        setValidValidators(oneKV.validatorCount);
        setActiveValidators(oneKV.electedCount);
        const oneKVNominators = await apiGetOneKVNominators({ params: chain });
        setElectedValidators(oneKVNominators.nominators.reduce((acc, n) => {
          acc += n.current.length;
          return acc;
        }, 0));
        oneKV = mergeOneKVData(oneKV, oneKVNominators);
        setValidators(oneKV.valid);
        setlastUpdatedTime(moment(oneKV.modifiedTime * 1000).toLocaleString());
      } catch (err) {
        console.error(err);
      }
    };
    getValidators();
  }, [chain]);
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
        <HeaderLayout>
          <HeaderLeft>
            <IconInput
              Icon={Search}
              iconSize="16px"
              placeholder="Polkadot/Kusama Stash ID or Name"
              inputLength={256}
              value={filters.stashId}
              onChange={handleFilterChange('stashId')}
            />
          </HeaderLeft>
          <HeaderRight>
            <HeaderItem>
              Era: <span style={{color: '#23b3b9', margin:'0 4px 0 4px'}}>{activeEra}</span>
            </HeaderItem>
            <HeaderItem>
              Valid Validators: <span style={{color: '#23b3b9', margin:'0 4px 0 4px'}}>{validValidators}</span>
            </HeaderItem>
            <HeaderItem>
              Active Validators: <span style={{color: '#23b3b9', margin:'0 4px 0 4px'}}>{activeValidators}</span>
            </HeaderItem>
            <HeaderItem>
              1KV Elected Validators: <span style={{color: '#23b3b9', margin:'0 4px 0 4px'}}>{electedValidators}</span>
            </HeaderItem>
            <HeaderItem>
              Last Updated Time: <span style={{color: '#23b3b9', margin:'0 4px 0 4px'}}>{lastUpdatedTime}</span>
            </HeaderItem>
          </HeaderRight>
        </HeaderLayout>
      </OptionBar>
      <ValidatorTable
        filter={filters}
        chain={chain}
        validators={validators}/>
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
      <ValNomContent />
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

const HeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
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

const HeaderItem = styled.div`
  display: flex;
  flex-direction: row;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.42;
  letter-spacing: normal;
  text-align: left;
  color: white;
  margin: 0 20px 0 20px;
  align-item: center;
`;