import { useEffect, useMemo, useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { ReactComponent as TinyChart } from '../../../assets/images/tiny-chart.svg';
import { ReactComponent as TinyPlain } from '../../../assets/images/tiny-paper-plain.svg';
import { ReactComponent as TelegramLogo } from '../../../assets/images/telegram-logo.svg';
import { ReactComponent as EmailLogo } from '../../../assets/images/mail-logo.svg';
import { ReactComponent as OptionIcon } from '../../../assets/images/option-icon.svg';
import { ReactComponent as Qrcode } from '../../../assets/images/tg-qrcode.svg';
import DashboardItem from './DashboardItem';
import Tooltip from '../../../components/Tooltip';
import Dialog from '../../../components/Dialog';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Table from './Table';
import { ApiContext, ApiState } from '../../../components/Api';
import ScaleLoader from '../../../components/Spinner/ScaleLoader';
import { apiGetNotificationEvents } from '../../../apis/Events';
import { networkCapitalCodeName } from '../../../utils/parser';
import Identicon from '@polkadot/react-identicon';
import { useTranslation } from 'react-i18next';

const FilterType = {
  ALL: 'all',
  COMMISSION: 'commission',
  INACTIVE: 'inactive',
  SLASH: 'slash',
};

const Notification: React.FC = () => {
  const { t } = useTranslation();
  // context
  let { network: networkName, apiState: networkStatus, accounts } = useContext(ApiContext);

  const [overview, setOverview] = useState<any[]>([
    {
      value: 0,
      title: t('Management.routes.notification.overview.event.total.title'),
      subtitle: t('Management.routes.notification.overview.event.total.subtitle'),
      danger: false,
    },
    {
      value: 0,
      title: t('Management.routes.notification.overview.event.commission.title'),
      subtitle: t('Management.routes.notification.overview.event.commission.subtitle'),
      danger: false,
    },
    {
      value: 0,
      title: t('Management.routes.notification.overview.event.inactive.title'),
      subtitle: t('Management.routes.notification.overview.event.inactive.subtitle'),
      danger: false,
    },
    {
      value: 0,
      title: t('Management.routes.notification.overview.event.slash.title'),
      subtitle: t('Management.routes.notification.overview.event.slash.subtitle'),
      danger: true,
    },
  ]);
  const [notifyHistory, setNotifyHistory] = useState<any[]>([]);
  const [filterInfo, setFilterInfo] = useState({
    visible: false,
    type: FilterType.ALL,
  });
  const [isFetch, setIsFetch] = useState(true);
  const [isTgBotShow, setIsTgBotShow] = useState(false);
  const [isEmailSubscribeShow, setIsEmailSubscribeShow] = useState(false);

  useEffect(() => {
    if (networkStatus === ApiState.READY) {
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
            inactive: [0, 234],
          };
          if (result) {
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
                descriptionValue: i.total,
                era: i.era,
                affectedAccount: accounts[idx].address,
              });
            });
            result.inactive.forEach((i) => {
              tableList.push({
                type: FilterType.INACTIVE,
                descriptionAddress: '',
                descriptionValue: '',
                era: i,
                affectedAccount: accounts[idx].address,
              });
            });
            commissionCount += result.commissions.length;
            inactiveCount += result.inactive.length;
            slashCount += result.slashes.length;
          }
        }
        totalCount = commissionCount + inactiveCount + slashCount;
        setOverview([
          {
            value: totalCount,
            title: t('Management.routes.notification.overview.event.total.title'),
            subtitle: t('Management.routes.notification.overview.event.total.subtitle'),
            danger: false,
          },
          {
            value: commissionCount,
            title: t('Management.routes.notification.overview.event.commission.title'),
            subtitle: t('Management.routes.notification.overview.event.commission.subtitle'),
            danger: false,
          },
          {
            value: inactiveCount,
            title: t('Management.routes.notification.overview.event.inactive.title'),
            subtitle: t('Management.routes.notification.overview.event.inactive.subtitle'),
            danger: false,
          },
          {
            value: slashCount,
            title: t('Management.routes.notification.overview.event.slash.title'),
            subtitle: t('Management.routes.notification.overview.event.slash.subtitle'),
            danger: true,
          },
        ]);
        setNotifyHistory(tableList);
        setIsFetch(false);
      })();
    }
  }, [accounts, networkName, networkStatus, t]);

  const filteredNotifyList = useMemo(() => {
    let list = [...notifyHistory];
    list.sort((a: any, b: any) => {
      if (a.era > b.era) {
        return -1;
      } else if (a.era < b.era) {
        return 1;
      } else {
        return 0;
      }
    });
    if (filterInfo.type !== FilterType.ALL) {
      return list.filter((item) => item.type === filterInfo.type);
    }
    return list;
  }, [filterInfo.type, notifyHistory]);

  const filterSelect = useCallback((clickItem) => {
    setFilterInfo({ visible: false, type: clickItem });
  }, []);

  const filterToggle = useCallback((visible) => {
    setFilterInfo((prev) => ({ ...prev, visible: visible }));
  }, []);

  const handleDialogClose = (name) => {
    switch (name) {
      case 'tgBot':
        setIsTgBotShow(false);
        break;
      case 'emailSubscribe':
        setIsEmailSubscribeShow(false);
        break;
    }
  };

  const handleDialogOpen = (idx) => {
    switch (idx) {
      case 0:
        setIsTgBotShow(true);
        break;
      case 1:
        setIsEmailSubscribeShow(true);
        break;
    }
  };

  const columns = useMemo(() => {
    return [
      {
        Header: t('Management.routes.notification.notification.table.column.type'),
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
        Header: t('Management.routes.notification.notification.table.column.description'),
        accessor: 'description',
        disableSortBy: true,
        Cell: ({ row }) => {
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
                  <span
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {row.original.descriptionAddress}
                  </span>
                </div>
                <div>
                  change commission from {row.original.descriptionValue.split('#')[0]} to{' '}
                  {row.original.descriptionValue.split('#')[1]}
                </div>
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.INACTIVE) {
            return (
              <DescriptionStyle>All the validators are inactive in era {row.original.era}</DescriptionStyle>
            );
          } else {
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
                  <span
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {row.original.descriptionAddress}
                  </span>
                </div>
                <div>
                  is slashed by <span style={{ color: '#23beb9' }}>{row.original.descriptionValue}</span>
                  <span> {networkCapitalCodeName(networkName)}</span>
                </div>
              </DescriptionStyle>
            );
          }
        },
      },
      {
        Header: t('Management.routes.notification.notification.table.column.era'),
        accessor: 'era',
        disableSortBy: true,
      },
      {
        Header: t('Management.routes.notification.notification.table.column.affectedAccount'),
        accessor: 'account',
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Identicon value={row.original.affectedAccount} size={32} theme={'polkadot'} />{' '}
              <span
                style={{
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  marginLeft: 8,
                  textOverflow: 'ellipsis',
                }}
              >
                {row.original.affectedAccount}
              </span>
            </div>
          );
        },
      },
    ];
  }, [networkName, t]);

  const alertsMethod = useMemo(() => {
    return [
      {
        icon: TelegramLogo,
        title: t('Management.routes.notification.alerts.telegram.title'),
      },
      // {
      //   icon: EmailLogo,
      //   title: 'Receive alerts by Email',
      // },
    ];
  }, []);

  const dashBoardDOM = useMemo(() => {
    let overViewContent: any[] = [];
    let setUpAlerts: any[] = [];

    overview.forEach((i, idx) => {
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
      setUpAlerts.push(
        <DashboardItem
          MainIcon={i.icon}
          title={i.title}
          clickable={true}
          onClick={() => {
            handleDialogOpen(idx);
          }}
        />
      );
      if (idx === alertsMethod.length - 1) {
        setUpAlerts.push(<InvisibleSpace />);
      }
    });

    return (
      <Dashboard>
        <Dialog
          image={<Qrcode />}
          title={t('Management.routes.notification.alerts.telegram.dialog.title')}
          isOpen={isTgBotShow}
          handleDialogClose={() => {
            handleDialogClose('tgBot');
          }}
        ></Dialog>
        <Dialog
          title="Subscribe our email alert"
          isOpen={isEmailSubscribeShow}
          handleDialogClose={() => {
            handleDialogClose('emailSubscribe');
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Input placeholder="input your email address" style={{ textAlign: 'center' }} />
            <div style={{ marginTop: 40 }}>
              <Button
                disabled={false}
                title="Subscribe"
                onClick={() => {
                  console.log('onclick subscribe');
                }}
                style={{ width: 220 }}
              />
            </div>
          </div>
        </Dialog>
        <Overview>
          <DashboardTitle>
            <TinyChart /> {t('Management.routes.notification.overview.title')}
          </DashboardTitle>
          <OverviewPanel>{overViewContent}</OverviewPanel>
        </Overview>
        <Alerts>
          <DashboardTitle>
            <TinyPlain /> {t('Management.routes.notification.alerts.title')}
          </DashboardTitle>
          <OverviewPanel>{setUpAlerts}</OverviewPanel>
        </Alerts>
      </Dashboard>
    );
  }, [alertsMethod, isEmailSubscribeShow, isTgBotShow, overview, t]);

  const filterDOM = useMemo(() => {
    return (
      <FilterTooltip>
        <FilterOption
          selected={filterInfo.type === FilterType.ALL ? true : false}
          onClick={() => {
            filterSelect(FilterType.ALL);
          }}
        >
          {t('Management.routes.notification.filter.all')}
        </FilterOption>
        <FilterOption
          selected={filterInfo.type === FilterType.COMMISSION ? true : false}
          onClick={() => {
            filterSelect(FilterType.COMMISSION);
          }}
        >
          {t('Management.routes.notification.filter.commission')}
        </FilterOption>
        <FilterOption
          selected={filterInfo.type === FilterType.SLASH ? true : false}
          onClick={() => {
            filterSelect(FilterType.SLASH);
          }}
        >
          {t('Management.routes.notification.filter.slash')}
        </FilterOption>
        <FilterOption
          selected={filterInfo.type === FilterType.INACTIVE ? true : false}
          onClick={() => {
            filterSelect(FilterType.INACTIVE);
          }}
        >
          {t('Management.routes.notification.filter.inactive')}
        </FilterOption>
      </FilterTooltip>
    );
  }, [filterInfo.type, filterSelect, t]);

  const tableDOM = useMemo(() => {
    return (
      <TableLayout>
        <TablePanel>
          <Header>
            <Title>{t('Management.routes.notification.title')}</Title>
            <Tooltip content={filterDOM} visible={filterInfo.visible} tooltipToggle={filterToggle}>
              <Filter>
                <OptionIcon />
                <span style={{ marginLeft: 8 }}>
                  {t('Management.routes.notification.notification.filterTitle')}
                </span>
              </Filter>
            </Tooltip>
          </Header>
          <Table columns={columns} data={filteredNotifyList} pagination={true} />
        </TablePanel>
      </TableLayout>
    );
  }, [columns, filterDOM, filterInfo.visible, filterToggle, filteredNotifyList, t]);

  return (
    <MainLayout>
      {isFetch ? (
        <ScaleLoader />
      ) : (
        <>
          {dashBoardDOM}
          {tableDOM}
        </>
      )}
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
