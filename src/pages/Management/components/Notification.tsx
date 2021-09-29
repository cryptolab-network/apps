import { useEffect, useMemo, useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { ReactComponent as TinyChart } from '../../../assets/images/tiny-chart.svg';
import { ReactComponent as TinyPlain } from '../../../assets/images/tiny-paper-plain.svg';
import { ReactComponent as TelegramLogo } from '../../../assets/images/telegram-logo.svg';
import { ReactComponent as OptionIcon } from '../../../assets/images/option-icon.svg';
// import { ReactComponent as Qrcode } from '../../../assets/images/tg-qrcode.svg';
import QRCode from 'react-qr-code';
import DashboardItem from './DashboardItem';
import Tooltip from '../../../components/Tooltip';
import Dialog from '../../../components/Dialog';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Table from './Table';
import { api, ApiContext, ApiState } from '../../../components/Api';
import ScaleLoader from '../../../components/Spinner/ScaleLoader';
import { apiGetNotificationEvents, IEventQuery } from '../../../apis/Events';
import { networkCapitalCodeName } from '../../../utils/parser';
import Identicon from '@polkadot/react-identicon';
import { useTranslation } from 'react-i18next';
import keys from '../../../config/keys';
import DropdownCommon from '../../../components/Dropdown/Common';
import Account from '../../../components/Account';
import { getAccountName } from '../../../utils/account';
import { queryActiveEra } from '../../../utils/Network';
import { NetworkNameLowerCase } from '../../../utils/constants/Network';
import Empty from '../../../components/Empty';
import { NetworkConfig } from '../../../utils/constants/Network';
import bignumberjs from 'bignumber.js';

const FilterType = {
  ALL: 'all',
  COMMISSION: 'commission',
  INACTIVE: 'inactive',
  SLASH: 'slash',
  PAYOUT: 'payout',
  KICKS: 'kicks',
  OVERSUBSCRIBES: 'overSubscribes',
  STALEPAYOUTS: 'stalePayouts',
  CHILLS: 'chills',
};

const EVENT_7D_ERA = {
  KSM: 28,
  DOT: 7,
};

const ALL_ACCOUNT = 'ALL';

const Notification: React.FC = () => {
  const { t } = useTranslation();
  // context
  let { network: networkName, apiState: networkStatus, accounts, hasWeb3Injected } = useContext(ApiContext);

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
    // {
    //   value: 0,
    //   title: t('Management.routes.notification.overview.event.payout.title'),
    //   subtitle: t('Management.routes.notification.overview.event.payout.subtitle'),
    //   danger: false,
    // },
    {
      value: 0,
      title: t('Management.routes.notification.overview.event.kicks.title'),
      subtitle: t('Management.routes.notification.overview.event.kicks.subtitle'),
      danger: false,
    },
    {
      value: 0,
      title: t('Management.routes.notification.overview.event.overSubscribes.title'),
      subtitle: t('Management.routes.notification.overview.event.overSubscribes.subtitle'),
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
  const [selectedAccount, setSelectedAccount] = useState({ label: ALL_ACCOUNT, value: ALL_ACCOUNT });
  const [query, setQuery] = useState<IEventQuery | undefined>(undefined);

  const options = useMemo(() => {
    let list = [{ label: ALL_ACCOUNT, value: ALL_ACCOUNT }];
    const accountList = accounts.map((account) => {
      return {
        label: account.name || account.address,
        value: account.address,
      };
    });
    return list.concat(accountList);
  }, [accounts]);

  useEffect(() => {
    (async () => {
      if (networkStatus === ApiState.READY) {
        const activeEra = await queryActiveEra(api);
        let queryObj = {
          from_era:
            networkName.toLowerCase() === NetworkNameLowerCase.KSM
              ? activeEra - EVENT_7D_ERA.KSM
              : activeEra - EVENT_7D_ERA.DOT,
          to_era: activeEra,
        };
        setQuery(queryObj);
      } else {
        setQuery(undefined);
      }
    })();
  }, [networkName, networkStatus]);

  useEffect(() => {
    if (networkStatus === ApiState.READY && query && accounts && accounts.length > 0) {
      (async () => {
        let totalCount = 0;
        let commissionCount = 0;
        let inactiveCount = 0;
        let slashCount = 0;
        let payoutCount = 0;
        let kicksCount = 0;
        let overSubscribesCount = 0;
        let chillCount = 0;
        let stalePayoutCount = 0;
        let tableList: any[] = [];
        for (let idx = 0; idx < accounts.length; idx++) {
          let result = await apiGetNotificationEvents(
            {
              params: {
                id: accounts[idx].address,
                chain: networkCapitalCodeName(networkName),
              },
            },
            query
          );

          // mock data below for test convenient
          // let result = {
          //   commissions: [
          //     {
          //       commissionFrom: 0,
          //       commissionTo: 2,
          //       address: 'CgHEFst3jhyJZ57fSuAzRS6VaUrFL7BwFKi5XKWPV3g3zTo',
          //       era: 123,
          //     },
          //     {
          //       commissionFrom: 2,
          //       commissionTo: 3,
          //       address: 'CgHEFst3jhyJZ57fSuAzRS6VaUrFL7BwFKi5XKWPV3g3zTo',
          //       era: 234,
          //     },
          //   ],
          //   slashes: [
          //     {
          //       era: 123,
          //       validator: 'CgHEFst3jhyJZ57fSuAzRS6VaUrFL7BwFKi5XKWPV3g3zTo',
          //       total: 500000000000,
          //     },
          //   ],
          //   payouts: [
          //     {
          //       era: 168,
          //       amount: 1.1,
          //       address: 'FjuNAeqDWUSLbp11psbU3b2fCa8Zsj9JFKHhsmTHEXMbg8J',
          //     },
          //   ],
          //   inactive: [0, 234],
          //   overSubscribes: [
          //     {
          //       nominator: 'FjuNAeqDWUSLbp11psbU3b2fCa8Zsj9JFKHhsmTHEXMbg8J',
          //       address: 'CgHEFst3jhyJZ57fSuAzRS6VaUrFL7BwFKi5XKWPV3g3zTo',
          //       era: 2796,
          //       amount: '50000000000000',
          //     },
          //     {
          //       nominator: 'FjuNAeqDWUSLbp11psbU3b2fCa8Zsj9JFKHhsmTHEXMbg8J',
          //       address: 'CgHEFst3jhyJZ57fSuAzRS6VaUrFL7BwFKi5XKWPV3g3zTo',
          //       era: 2797,
          //       amount: '150000000000000',
          //     },
          //   ],
          //   kicks: [
          //     {
          //       era: 0,
          //       address: 'CgHEFst3jhyJZ57fSuAzRS6VaUrFL7BwFKi5XKWPV3g3zTo',
          //       nominator: 'FjuNAeqDWUSLbp11psbU3b2fCa8Zsj9JFKHhsmTHEXMbg8J',
          //     },
          //   ],
          //   stalePayouts: [
          //     {
          //       address: 'CgHEFst3jhyJZ57fSuAzRS6VaUrFL7BwFKi5XKWPV3g3zTo',
          //       era: 0,
          //       unclaimedPayoutEras: [0, 1, 2, 5],
          //     },
          //   ],
          //   chills: [
          //     {
          //       era: 0,
          //       address: 'CgHEFst3jhyJZ57fSuAzRS6VaUrFL7BwFKi5XKWPV3g3zTo',
          //     },
          //   ],
          // };

          if (result) {
            // filter commission from 0's validator, it means it's just initiate
            result.commissions = result.commissions.filter((item) => {
              return item.commissionFrom > 0 ? true : false;
            });
            result.commissions.forEach((i) => {
              if (i.commissionFrom > 0) {
                tableList.push({
                  type: FilterType.COMMISSION,
                  descriptionAddress: i.address,
                  descriptionValue: i.commissionFrom + '#' + i.commissionTo,
                  era: i.era,
                  affectedAccount: accounts[idx].address,
                });
              }
            });
            result.slashes.forEach((i) => {
              tableList.push({
                type: FilterType.SLASH,
                descriptionAddress: i.validator,
                descriptionValue: i.total / Math.pow(10, NetworkConfig[networkName].decimals),
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
            result.payouts.forEach((i) => {
              tableList.push({
                type: FilterType.PAYOUT,
                descriptionAddress: i.address,
                descriptionValue: i.amount,
                era: i.era,
                affectedAccount: accounts[idx].address,
              });
            });
            result.kicks.forEach((i) => {
              tableList.push({
                type: FilterType.KICKS,
                descriptionAddress: i.address,
                descriptionValue: '',
                era: i.era,
                affectedAccount: accounts[idx].address,
              });
            });
            result.overSubscribes.forEach((i) => {
              tableList.push({
                type: FilterType.OVERSUBSCRIBES,
                descriptionAddress: i.address,
                descriptionValue: new bignumberjs(i.amount)
                  .dividedBy(Math.pow(10, NetworkConfig[networkName].decimals))
                  .toString(),
                era: i.era,
                affectedAccount: accounts[idx].address,
              });
            });
            result.stalePayouts.forEach((i) => {
              tableList.push({
                type: FilterType.STALEPAYOUTS,
                descriptionAddress: i.address,
                descriptionValue: i.unclaimedPayoutEras.length,
                era: i.era,
                affectedAccount: accounts[idx].address,
              });
            });
            result.chills.forEach((i) => {
              tableList.push({
                type: FilterType.CHILLS,
                descriptionAddress: i.address,
                descriptionValue: '',
                era: i.era,
                affectedAccount: accounts[idx].address,
              });
            });

            commissionCount += result.commissions.length;
            inactiveCount += result.inactive.length;
            slashCount += result.slashes.length;
            payoutCount += result.payouts.length;
            kicksCount += result.kicks.length;
            overSubscribesCount += result.overSubscribes.length;
            chillCount += result.chills.length;
            stalePayoutCount += result.stalePayouts.length;
          }
        }
        totalCount =
          commissionCount +
          inactiveCount +
          slashCount +
          payoutCount +
          kicksCount +
          overSubscribesCount +
          chillCount +
          stalePayoutCount;
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
            value: kicksCount,
            title: t('Management.routes.notification.overview.event.kicks.title'),
            subtitle: t('Management.routes.notification.overview.event.kicks.subtitle'),
            danger: false,
          },
          {
            value: overSubscribesCount,
            title: t('Management.routes.notification.overview.event.overSubscribes.title'),
            subtitle: t('Management.routes.notification.overview.event.overSubscribes.subtitle'),
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
  }, [accounts, networkName, networkStatus, t, query]);

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
      list = list.filter((item) => item.type === filterInfo.type);
    }
    if (selectedAccount.value !== ALL_ACCOUNT) {
      list = list.filter((item) => item.affectedAccount === selectedAccount.value);
    }
    return list;
  }, [filterInfo.type, selectedAccount, notifyHistory]);

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

  const handleFilterChange = (e) => {
    setSelectedAccount(e);
  };

  const columns = useMemo(() => {
    return [
      {
        Header: t('Management.routes.notification.notification.table.column.type'),
        accessor: 'type',
        disableSortBy: true,
        Cell: ({ row }) => {
          if (row.original.type === FilterType.COMMISSION) {
            return (
              <DescriptionStyle>
                {t('Management.routes.notification.notification.table.data.commission.title')}
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.INACTIVE) {
            return (
              <DescriptionStyle>
                {t('Management.routes.notification.notification.table.data.inactive.title')}
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.SLASH) {
            return (
              <DescriptionStyle>
                {t('Management.routes.notification.notification.table.data.slash.title')}
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.KICKS) {
            return (
              <DescriptionStyle>
                {t('Management.routes.notification.notification.table.data.kick.title')}
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.OVERSUBSCRIBES) {
            return (
              <DescriptionStyle>
                {t('Management.routes.notification.notification.table.data.overSubscribes.title')}
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.PAYOUT) {
            return (
              <DescriptionStyle>
                {t('Management.routes.notification.notification.table.data.payout.title')}
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.STALEPAYOUTS) {
            return (
              <DescriptionStyle>
                {t('Management.routes.notification.notification.table.data.stalePayout.title')}
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.CHILLS) {
            return (
              <DescriptionStyle>
                {t('Management.routes.notification.notification.table.data.chill.title')}
              </DescriptionStyle>
            );
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
                  <span
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('Management.routes.notification.notification.table.data.commission.validator')}
                  </span>

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
                  {t('Management.routes.notification.notification.table.data.commission.action')}{' '}
                  {row.original.descriptionValue.split('#')[0]}{' '}
                  {t('Management.routes.notification.notification.table.data.commission.to')}{' '}
                  {row.original.descriptionValue.split('#')[1]}
                </div>
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.INACTIVE) {
            return (
              <DescriptionStyle>
                {t('Management.routes.notification.notification.table.data.inactive.description')}{' '}
                {row.original.era}
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.SLASH) {
            return (
              <DescriptionStyle>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('Management.routes.notification.notification.table.data.slash.validator')}
                  </span>

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
                  {t('Management.routes.notification.notification.table.data.slash.action')}{' '}
                  <span style={{ color: '#23beb9' }}>{row.original.descriptionValue}</span>
                  <span> {networkCapitalCodeName(networkName)}</span>
                </div>
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.PAYOUT) {
            return (
              <DescriptionStyle>
                <div>
                  {t('Management.routes.notification.notification.table.data.payout.action')}{' '}
                  <span style={{ color: '#23beb9' }}>{row.original.descriptionValue}</span>
                  <span> {networkCapitalCodeName(networkName)}</span>
                </div>
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.KICKS) {
            return (
              <DescriptionStyle>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('Management.routes.notification.notification.table.data.kick.validator')}
                  </span>

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
                <div>{t('Management.routes.notification.notification.table.data.kick.action')}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('Management.routes.notification.notification.table.data.kick.nominator')}
                  </span>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      marginLeft: 8,
                      marginRight: 8,
                    }}
                  >
                    <Identicon value={row.original.affectedAccount} size={32} theme={'polkadot'} />
                  </div>
                  <span
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {row.original.affectedAccount}
                  </span>
                </div>
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.OVERSUBSCRIBES) {
            return (
              <DescriptionStyle>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('Management.routes.notification.notification.table.data.overSubscribes.validator')}
                  </span>

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
                <span>
                  {t('Management.routes.notification.notification.table.data.overSubscribes.action')}
                  <span style={{ color: '#23beb9' }}> {row.original.descriptionValue} </span>

                  {networkCapitalCodeName(networkName)}
                  {t('Management.routes.notification.notification.table.data.overSubscribes.description')}
                </span>
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.STALEPAYOUTS) {
            return (
              <DescriptionStyle>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('Management.routes.notification.notification.table.data.stalePayout.validator')}
                  </span>

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
                  <span>
                    {t('Management.routes.notification.notification.table.data.stalePayout.description')}{' '}
                  </span>
                  <span style={{ color: '#23beb9' }}>{row.original.descriptionValue}</span>
                  <span>
                    {' '}
                    {t('Management.routes.notification.notification.table.data.stalePayout.action')}
                  </span>
                </div>
              </DescriptionStyle>
            );
          } else if (row.original.type === FilterType.CHILLS) {
            return (
              <DescriptionStyle>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('Management.routes.notification.notification.table.data.chill.validator')}
                  </span>

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
                  <span>{t('Management.routes.notification.notification.table.data.chill.action')}</span>
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
            <span>
              {
                <Account
                  address={row.original.affectedAccount}
                  display={getAccountName(row.original.affectedAccount, accounts)}
                />
              }
            </span>
          );
        },
      },
    ];
  }, [accounts, networkName, t]);

  const alertsMethod = useMemo(() => {
    return [
      {
        icon: TelegramLogo,
        title: t('Management.routes.notification.alerts.telegram.title'),
      },
    ];
  }, [t]);

  const dashBoardDOM = useMemo(() => {
    let overViewContent: any[] = [];
    let setUpAlerts: any[] = [];

    overview.forEach((i, idx) => {
      if (idx === 0) {
        overViewContent.push(<InvisibleSpace key={`dashboard-invisible-${idx}`} />);
      }
      if (idx > 0) {
        overViewContent.push(<Space key={`dashboard-space-${idx}`} />);
      }
      overViewContent.push(
        <DashboardItem
          key={`dashboard-item-${idx}`}
          mainValue={i.value}
          mainValueDanger={i.danger}
          title={i.title}
          subtitle={i.subtitle}
        />
      );
      if (idx === overview.length - 1) {
        overViewContent.push(<InvisibleSpace />);
      }
    });

    alertsMethod.forEach((i, idx) => {
      if (idx === 0) {
        setUpAlerts.push(<InvisibleSpace key={`alerts-invisible-${idx}`} />);
      }
      if (idx > 0) {
        setUpAlerts.push(<Space key={`alerts-space-${idx}`} />);
      }
      setUpAlerts.push(
        <DashboardItem
          key={`alerts-item-${idx}`}
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
          image={<QRCode level="L" size={256} value={keys.tgBotUrl} bgColor="#18232f" fgColor="#23beb9" />}
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
                  // console.log('onclick subscribe');
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
          {t('Management.routes.notification.notification.filter.all')}
        </FilterOption>
        <FilterOption
          selected={filterInfo.type === FilterType.COMMISSION ? true : false}
          onClick={() => {
            filterSelect(FilterType.COMMISSION);
          }}
        >
          {t('Management.routes.notification.notification.filter.commission')}
        </FilterOption>
        <FilterOption
          selected={filterInfo.type === FilterType.SLASH ? true : false}
          onClick={() => {
            filterSelect(FilterType.SLASH);
          }}
        >
          {t('Management.routes.notification.notification.filter.slash')}
        </FilterOption>
        <FilterOption
          selected={filterInfo.type === FilterType.INACTIVE ? true : false}
          onClick={() => {
            filterSelect(FilterType.INACTIVE);
          }}
        >
          {t('Management.routes.notification.notification.filter.inactive')}
        </FilterOption>
        <FilterOption
          selected={filterInfo.type === FilterType.PAYOUT ? true : false}
          onClick={() => {
            filterSelect(FilterType.PAYOUT);
          }}
        >
          {t('Management.routes.notification.notification.filter.payout')}
        </FilterOption>

        <FilterOption
          selected={filterInfo.type === FilterType.KICKS ? true : false}
          onClick={() => {
            filterSelect(FilterType.KICKS);
          }}
        >
          {t('Management.routes.notification.notification.filter.kick')}
        </FilterOption>
        <FilterOption
          selected={filterInfo.type === FilterType.OVERSUBSCRIBES ? true : false}
          onClick={() => {
            filterSelect(FilterType.OVERSUBSCRIBES);
          }}
        >
          {t('Management.routes.notification.notification.filter.overSubscribes')}
        </FilterOption>
        <FilterOption
          selected={filterInfo.type === FilterType.STALEPAYOUTS ? true : false}
          onClick={() => {
            filterSelect(FilterType.STALEPAYOUTS);
          }}
        >
          {t('Management.routes.notification.notification.filter.stalePayout')}
        </FilterOption>
        <FilterOption
          selected={filterInfo.type === FilterType.CHILLS ? true : false}
          onClick={() => {
            filterSelect(FilterType.CHILLS);
          }}
        >
          {t('Management.routes.notification.notification.filter.chill')}
        </FilterOption>
        <FilterTitle>{t('Management.routes.notification.notification.filter.account')}</FilterTitle>
        <div style={{ minWidth: 180, maxWidth: 250 }}>
          <DropdownCommon
            style={{ flex: 1, width: '100%' }}
            options={options}
            value={selectedAccount}
            onChange={handleFilterChange}
            theme="dark"
          />
        </div>
      </FilterTooltip>
    );
  }, [filterInfo.type, filterSelect, t, options, selectedAccount]);

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
      {!hasWeb3Injected ? (
        <Empty />
      ) : isFetch ? (
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
  flex: 5;
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

const FilterTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 26px;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  color: white;
  cursor: pointer;
`;

const DescriptionStyle = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  color: white;
`;
