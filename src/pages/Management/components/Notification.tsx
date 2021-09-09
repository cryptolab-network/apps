import { useEffect, useMemo, useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { ReactComponent as TinyChart } from '../../../assets/images/tiny-chart.svg';
import { ReactComponent as TinyPlain } from '../../../assets/images/tiny-paper-plain.svg';
import { ReactComponent as TelegramLogo } from '../../../assets/images/telegram-logo.svg';
import { ReactComponent as EmailLogo } from '../../../assets/images/mail-logo.svg';
import { ReactComponent as OptionIcon } from '../../../assets/images/option-icon.svg';
import DashboardItem from './DashboardItem';
import Tooltip from '../../../components/Tooltip';
import Table from './Table';
import { ApiContext } from '../../../components/Api';
import { apiGetNotificationEvents } from '../../../apis/Events';
import { networkCapitalCodeName } from '../../../utils/parser';
import Identicon from '@polkadot/react-identicon';

const FilterType = {
  ALL: 'all',
  COMMISSION: 'commission',
  INACTIVE: 'inactive',
  SLASH: 'slash',
};

const columns = [
  {
    Header: 'Event type',
    accessor: 'type',
    disableSortBy: true,
    Cell: ({ row }) => {
      if (row.original.type === FilterType.COMMISSION) {
        return <DescriptionStyle>Commission change</DescriptionStyle>;
      } else if (row.original.type === FilterType.INACTIVE) {
        return <DescriptionStyle>All inactive</DescriptionStyle>;
      } else {
        return <DescriptionStyle>slash</DescriptionStyle>;
      }
    },
  },
  {
    Header: 'Description',
    accessor: 'description',
    disableSortBy: true,
    Cell: ({ row }) => {
      console.log('row: ', row);
      if (row.original.type === FilterType.COMMISSION) {
        return (
          <DescriptionStyle>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              Validator
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginLeft: 8,
                  marginRight: 8,
                }}
              >
                <Identicon value={row.original.descriptionAddress} size={32} theme={'polkadot'} />
              </div>
              {row.original.descriptionAddress.substring(0, 8)}...
            </div>
            <div>
              change commission from {row.original.descriptionValue.split('#')[0]} to{' '}
              {row.original.descriptionValue.split('#')[1]}
            </div>
          </DescriptionStyle>
        );
      } else if (row.original.type === FilterType.INACTIVE) {
        return null;
      } else {
        return null;
      }
    },
  },
  {
    Header: 'Era',
    accessor: 'era',
    disableSortBy: true,
  },
  {
    Header: 'Affected account',
    accessor: 'account',
    disableSortBy: true,
    Cell: ({ row }) => {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Identicon value={row.original.affectedAccount} size={32} theme={'polkadot'} />{' '}
          <span style={{ marginLeft: 8 }}>{row.original.affectedAccount.substring(0, 12)}...</span>
        </div>
      );
    },
  },
];

const Notification: React.FC = () => {
  // context
  let { network: networkName, apiState: networkStatus, accounts } = useContext(ApiContext);

  const [overview, setOverview] = useState<any[]>([
    {
      value: 0,
      title: 'total events',
      subtitle: 'Past 7 days',
      danger: false,
    },
    {
      value: 0,
      title: 'Commission Change events',
      subtitle: 'Past 7 days',
      danger: false,
    },
    {
      value: 0,
      title: 'All inactive events',
      subtitle: 'Past 7 days',
      danger: false,
    },
    {
      value: 0,
      title: 'Slash events',
      subtitle: 'Past 7 days',
      danger: true,
    },
  ]);
  const [notifyHistory, setNotifyHistory] = useState<any[]>([]);
  const [filterInfo, setFilterInfo] = useState({
    visible: false,
    type: FilterType.ALL,
  });

  useEffect(() => {
    console.log('accounts: ', accounts);
    (async () => {
      let totalCount = 0;
      let commissionCount = 0;
      let inactiveCount = 0;
      let slashCount = 0;
      let tableList: any[] = [];
      for (let idx = 0; idx < accounts.length; idx++) {
        // let result = await apiGetNotificationEvents({
        //   params: {
        //     id: accounts[idx].address,
        //     chain: networkCapitalCodeName(networkName),
        //   },
        // });
        // TODO: remove mock data below
        let result = {
          commissions: [
            {
              commissionFrom: 1,
              commissionTo: 2,
              address: 'H4EeouHL5LawTqq2itu6auF62hDRX2LEBYk1TxS6QMrn9Hg',
              era: 123,
            },
            {
              commissionFrom: 2,
              commissionTo: 3,
              address: 'H4EeouHL5LawTqq2itu6auF62hDRX2LEBYk1TxS6QMrn9Hg',
              era: 234,
            },
          ],
          slashes: [
            {
              era: 123,
              validator: 'H4EeouHL5LawTqq2itu6auF62hDRX2LEBYk1TxS6QMrn9Hg',
              total: 5,
            },
          ],
          inactives: [0, 234],
        };
        result.commissions.forEach((i) => {
          tableList.push({
            type: FilterType.COMMISSION,
            descriptionAddress: i.address,
            descriptionValue: i.commissionFrom + '#' + i.commissionTo,
            era: i.era,
            affectedAccount: accounts[idx].address,
          });
        });
        result.slashes.forEach((i) => {
          tableList.push({
            type: FilterType.SLASH,
            descriptionAddress: i.validator,
            descriptionValue: '',
            era: i.era,
            affectedAccount: accounts[idx].address,
          });
        });
        result.inactives.forEach((i) => {
          tableList.push({
            type: FilterType.INACTIVE,
            descriptionAddress: '',
            descriptionValue: '',
            era: i,
            affectedAccount: accounts[idx].address,
          });
        });

        commissionCount += result.commissions.length;
        inactiveCount += result.commissions.length;
        slashCount += result.commissions.length;
      }
      totalCount = commissionCount + inactiveCount + slashCount;
      setOverview([
        {
          value: totalCount,
          title: 'total events',
          subtitle: 'Past 7 days',
          danger: false,
        },
        {
          value: commissionCount,
          title: 'Commission Change events',
          subtitle: 'Past 7 days',
          danger: false,
        },
        {
          value: inactiveCount,
          title: 'All inactive events',
          subtitle: 'Past 7 days',
          danger: false,
        },
        {
          value: slashCount,
          title: 'Slash events',
          subtitle: 'Past 7 days',
          danger: true,
        },
      ]);
      setNotifyHistory(tableList);
    })();
  }, [accounts, networkName]);

  const filterSelect = useCallback((clickItem) => {
    setFilterInfo({ visible: false, type: clickItem });
  }, []);

  const filterToggle = useCallback((visible) => {
    setFilterInfo((prev) => ({ ...prev, visible: visible }));
  }, []);

  const alertsMethod = useMemo(() => {
    return [
      {
        icon: TelegramLogo,
        title: 'Receive alerts by Telegram',
      },
      {
        icon: EmailLogo,
        title: 'Receive alerts by Email',
      },
    ];
  }, []);

  const dashBoardDOM = useMemo(() => {
    let overViewContent: any[] = [];
    let setUpAlerts: any[] = [];

    overview.forEach((i, idx) => {
      console.log('overview idx: ', idx);
      console.log(i.value);
      console.log(i.danger);
      console.log(i.title);
      console.log(i.subtitle);
      if (idx === 0) {
        overViewContent.push(<InvisibleSpace />);
      }
      if (idx > 0) {
        overViewContent.push(<Space />);
      }
      overViewContent.push(
        <DashboardItem mainValue={i.value} mainValueDanger={i.danger} title={i.title} subtitle={i.subtitle} />
      );
      if (idx === overview.length - 1) {
        overViewContent.push(<InvisibleSpace />);
      }
    });

    alertsMethod.forEach((i, idx) => {
      if (idx === 0) {
        setUpAlerts.push(<InvisibleSpace />);
      }
      if (idx > 0) {
        setUpAlerts.push(<Space />);
      }
      setUpAlerts.push(<DashboardItem MainIcon={i.icon} title={i.title} clickable={true} />);
      if (idx === alertsMethod.length - 1) {
        setUpAlerts.push(<InvisibleSpace />);
      }
    });

    return (
      <Dashboard>
        <Overview>
          <DashboardTitle>
            <TinyChart /> Overview
          </DashboardTitle>
          <OverviewPanel>{overViewContent}</OverviewPanel>
        </Overview>
        <Alerts>
          <DashboardTitle>
            <TinyPlain /> Set up alerts
          </DashboardTitle>
          <OverviewPanel>{setUpAlerts}</OverviewPanel>
        </Alerts>
      </Dashboard>
    );
  }, [alertsMethod, overview]);

  const filterDOM = useMemo(() => {
    return (
      <FilterTooltip>
        <FilterOption
          selected={filterInfo.type === FilterType.ALL ? true : false}
          onClick={() => {
            filterSelect(FilterType.ALL);
          }}
        >
          all event
        </FilterOption>
        <FilterOption
          selected={filterInfo.type === FilterType.COMMISSION ? true : false}
          onClick={() => {
            filterSelect(FilterType.COMMISSION);
          }}
        >
          commission change
        </FilterOption>
        <FilterOption
          selected={filterInfo.type === FilterType.INACTIVE ? true : false}
          onClick={() => {
            filterSelect(FilterType.INACTIVE);
          }}
        >
          slash
        </FilterOption>
        <FilterOption
          selected={filterInfo.type === FilterType.SLASH ? true : false}
          onClick={() => {
            filterSelect(FilterType.SLASH);
          }}
        >
          all inactive
        </FilterOption>
      </FilterTooltip>
    );
  }, [filterInfo.type, filterSelect]);

  const tableDOM = useMemo(() => {
    return (
      <TableLayout>
        <TablePanel>
          <Header>
            <Title>Nofitications</Title>
            <Tooltip content={filterDOM} visible={filterInfo.visible} tooltipToggle={filterToggle}>
              <Filter>
                <OptionIcon />
                <span style={{ marginLeft: 8 }}>Search events</span>
              </Filter>
            </Tooltip>
          </Header>
          <Table columns={columns} data={notifyHistory} pagination={true} />
        </TablePanel>
      </TableLayout>
    );
  }, [filterDOM, filterInfo.visible, filterToggle, notifyHistory]);

  return (
    <MainLayout>
      {dashBoardDOM}
      {tableDOM}
    </MainLayout>
  );
};

export default Notification;

const MainLayout = styled.div`
  box-sizing: border-box;
  min-width: 1100px;
  /* height: 70vh; */
  border-radius: 8px;
  border: solid 1px #23beb9;
  background-color: #18232f;
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 7px;
  @media (max-width: 1395px) {
    width: 95vw;
  }
`;

const Dashboard = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const DashboardTitle = styled.div`
  height: 40px;
  font-family: Montserrat;
  font-size: 15px;
  font-weight: bold;
  text-align: left;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overview = styled.div`
  flex: 2;
  box-sizing: border-box;
  padding: 7px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const Space = styled.div`
  height: 100%;
  width: 0px;
  border: solid 1px #17212d;
`;

const InvisibleSpace = styled.div`
  height: 100%;
  width: 0px;
  border: solid 1px transparent;
`;

const OverviewPanel = styled.div`
  box-sizing: border-box;
  height: 200px;
  width: 100%;
  border-radius: 8px;
  background-color: #2e3843;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 45px 0px 45px 0px;
`;

const Alerts = styled.div`
  flex: 1;
  box-sizing: border-box;
  padding: 7px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const TableLayout = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 7px;
`;

const TablePanel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 13px;
  border-radius: 8px;
  background-color: #2e3843;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  color: white;
`;

const Filter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  color: #23beb9;
`;

const FilterTooltip = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

interface IFilterOption {
  selected: boolean;
}
const FilterOption = styled.div<IFilterOption>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 26px;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  color: ${(props) => (props.selected ? '#23beb9' : 'white')};
  cursor: pointer;
`;

const DescriptionStyle = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  color: white;
`;
