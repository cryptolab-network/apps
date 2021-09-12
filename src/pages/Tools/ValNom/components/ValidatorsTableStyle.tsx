import { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import styled from 'styled-components';
import { ReactComponent as PeopleIcon } from '../../../../assets/images/people.svg';
import { ReactComponent as Search } from '../../../../assets/images/search.svg';
import CardHeader from '../../../../components/Card/CardHeader';
import IconInput from '../../../../components/Input/IconInput';
import Table from '../../../../components/Table';
import Account from '../../../../components/Account';
import { apiGetAllValidator, IValidator } from '../../../../apis/Validator';
import { DataContext } from '../../components/Data';
import { balanceUnit } from '../../../../utils/string';
import { NetworkConfig } from '../../../../utils/constants/Network';

const ValNomHeader = () => {
  return (
    <HeaderLayout>
      <HeaderLeft>
        <PeopleIcon />
        <HeaderTitle>
          <Title>Validator / Nominator Status</Title>
          <Subtitle>
            See filtered validator status or enter a nominator stash ID to see its nominated validators
          </Subtitle>
        </HeaderTitle>
      </HeaderLeft>
    </HeaderLayout>
  );
};

const ValidatorTable = () => {
  const { network: networkName } = useContext(DataContext);
  const chain = NetworkConfig[networkName].token;
  const _formatBalance = useCallback(
    (value: any) => {
      return <span>{balanceUnit(chain, value, true, true)}</span>;
    },
    [chain]
  );
  const columns = useMemo(() => {
    return [
      {
        Header: 'Favorite',
        accessor: 'favorite',
        maxWidth: 48,
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        Header: 'Name',
        accessor: 'id',
        maxWidth: 180,
        Cell: (props) => {
          return <Account address={props.row.original.id} display={props.row.original.identity.display} />;
        },
      },
      {
        Header: 'Commission',
        accessor: 'info.commission',
        maxWidth: 48,
        Cell: ({ value }) => <span>{value}%</span>,
      },
      {
        Header: '84-era Average APY',
        accessor: 'averageApy',
        maxWidth: 60,
        Cell: ({ value }) => {
          return <span>{(value * 100).toFixed(2)}%</span>;
        },
      },
      {
        Header: 'Self Stake',
        accessor: 'info.exposure.own',
        maxWidth: 150,
        Cell: ({ value }) => {
          return <span>{_formatBalance(value)}</span>;
        },
      },
      {
        Header: 'Total Stake',
        accessor: 'info.exposure.total',
        maxWidth: 150,
        Cell: ({ value }) => {
          return <span>{_formatBalance(value)}</span>;
        },
      },
    ];
  }, [_formatBalance]);
  const [validators, setValidators] = useState<IValidator[]>([]);
  useEffect(() => {
    async function getValidators() {
      try {
        const validators = await apiGetAllValidator({ params: 'KSM' });
        setValidators(validators);
      } catch (err) {
        console.error(err);
      }
    }
    getValidators();
  }, [chain]);
  return <Table columns={columns} data={validators} />;
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
