import { useEffect, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import CardHeader from '../../../components/Card/CardHeader';
import Input from '../../../components/Input';
import DropdownCommon from '../../../components/Dropdown/Common';
import Node from '../../../components/Node';
import Warning from '../../../components/Hint/Warn';
import TimeCircle from '../../../components/Time/Circle';
import TitleInput from '../../../components/Input/TitleInput';
import TitleSwitch from '../../../components/Switch/TitleSwitch';
import Table from './Table';
import Account from '../../../components/Account';
import Button from '../../../components/Button';
import Era from './Table/comopnents/Era';
import EraInclusion from './Table/comopnents/EraInclusion';
import ScaleLoader from '../../../components/Spinner/ScaleLoader';
import { ReactComponent as KSMLogo } from '../../../assets/images/ksm-logo.svg';
import { ReactComponent as DOTLogo } from '../../../assets/images/dot-logo.svg';
import { ReactComponent as GreenArrow } from '../../../assets/images/green-arrow.svg';
import { ReactComponent as HandTrue } from '../../../assets/images/hand-up-true.svg';
import { ReactComponent as HandFalse } from '../../../assets/images/hand-up-false.svg';
import { ReactComponent as CheckTrue } from '../../../assets/images/check-true.svg';
import { ReactComponent as CheckFalse } from '../../../assets/images/check-false.svg';
import { eraStatus } from '../../../utils/status/Era';
import { tableType } from '../../../utils/status/Table';
import { networkCapitalCodeName } from '../../../utils/parser';
import { apiGetAllValidator } from '../../../apis/Validator';
import { useAppSelector } from '../../../hooks';

import StakingHeader from './Header';
import { NetworkStatus } from '../../../utils/status/Network';
import { NetworkCodeName } from '../../../utils/constants/Network';
import {
  lowRiskStrategy,
  highApyStrategy,
  decentralStrategy,
  oneKvStrategy,
  customStrategy,
  advancedConditionFilter,
  apyCalculation,
} from './utils';
import { IValidator } from '../../../apis/Validator';
import axios from 'axios';
import { toast } from 'react-toastify';

enum Strategy {
  LOW_RISK,
  HIGH_APY,
  DECENTRAL,
  ONE_KV,
  CUSTOM,
}

interface IStrategy {
  label: string;
  value: Strategy;
}

export interface IAdvancedSetting {
  // minSelfStake: number | null; // input amount
  maxCommission?: string | null; // input amount
  identity?: boolean; // switch
  maxUnclaimedEras?: string | null; // input amount
  previousSlashes?: boolean; // switch
  isSubIdentity?: boolean; // switch
  historicalApy?: string | null; // input %
  minInclusion?: string | null; // input %
  telemetry?: boolean; // switch
  highApy?: boolean; // switch
  decentralized?: boolean; // switch
  oneKv?: boolean; // switch
}

export interface IStakingInfo {
  tableData: ITableData[];
  calculatedApy: number;
  selectableCount?: number;
}

export interface ITableData {
  select: boolean;
  account: string;
  selfStake: number;
  eraInclusion: {
    rate: string;
    activeCount: number;
    total: number;
  };
  unclaimedEras: number;
  avgAPY: number;
  active: boolean;
  subRows: {
    unclaimedEras: number[];
  }[];
  commission: number;
  hasSlash: boolean;
  isSubIdentity: boolean;
  identity: {
    parent: string | null | undefined;
  };
}

interface IApiParams {
  network: string;
  page?: number;
  size?: number;
  has_telemetry?: boolean;
  apy_min?: number;
  apy_max?: number;
  commission_min?: number;
  commission_max?: number;
  has_verified_identity?: boolean;
  has_joined_1kv?: boolean;
}

const StrategyConfig = {
  LOW_RISK: {
    maxCommission: '', // input amount
    identity: true, // switch
    maxUnclaimedEras: '16', // input amount
    previousSlashes: false, // switch
    isSubIdentity: false, // switch
    historicalApy: '', // input %
    minInclusion: '', // input %
    telemetry: true, // switch
    highApy: false, // switch
    decentralized: false, // switch
    oneKv: false, // switch
  },
  HIGH_APY: {
    maxCommission: '', // input amount
    identity: false, // switch
    maxUnclaimedEras: '', // input amount
    previousSlashes: true, // switch
    isSubIdentity: false, // switch
    historicalApy: '', // input %
    minInclusion: '', // input %
    telemetry: false, // switch
    highApy: true, // switch
    decentralized: false, // switch
    oneKv: false, // switch
  },
  DECENTRAL: {
    maxCommission: '', // input amount
    identity: true, // switch
    maxUnclaimedEras: '', // input amount
    previousSlashes: false, // switch
    isSubIdentity: false, // switch
    historicalApy: '', // input %
    minInclusion: '', // input %
    telemetry: false, // switch
    highApy: false, // switch
    decentralized: true, // switch
    oneKv: false, // switch
  },
  ONE_KV: {
    maxCommission: '', // input amount
    identity: false, // switch
    maxUnclaimedEras: '', // input amount
    previousSlashes: false, // switch
    isSubIdentity: false, // switch
    historicalApy: '', // input %
    minInclusion: '', // input %
    telemetry: false, // switch
    highApy: false, // switch
    decentralized: false, // switch
    oneKv: true, // switch
  },
  CUSTOM: {
    maxCommission: '', // input amount
    identity: false, // switch
    maxUnclaimedEras: '', // input amount
    previousSlashes: false, // switch
    isSubIdentity: false, // switch
    historicalApy: '', // input %
    minInclusion: '', // input %
    telemetry: false, // switch
    highApy: false, // switch
    decentralized: false, // switch
    oneKv: false, // switch
  },
};

const BASIC_DEFAULT_STRATEGY = { label: 'Low risk', value: Strategy.LOW_RISK };
const ADVANCED_DEFAULT_STRATEGY = { label: 'Custom', value: Strategy.CUSTOM };

const Staking = () => {
  // redux
  let { name: networkName, status: networkStatus } = useAppSelector((state) => state.network);
  let { selectedAccount } = useAppSelector((state) => state.wallet);

  // state
  const [inputData, setInputData] = useState({
    stakeAmount: 0,
    strategy: BASIC_DEFAULT_STRATEGY,
    rewardDestination: null,
  });

  const [advancedOption, setAdvancedOption] = useState({
    toggle: false,
    advanced: false,
    supportus: false,
  });
  const [advancedSetting, setAdvancedSetting] = useState<IAdvancedSetting>(StrategyConfig.LOW_RISK);
  const [apiParams, setApiParams] = useState<IApiParams>({
    network: 'KSM',
    page: 0,
    size: 60,
  });
  const [apiLoading, setApiLoading] = useState(true);
  const [apiFilteredTableData, setApiFilteredTableData] = useState<IStakingInfo>({
    tableData: [],
    calculatedApy: 0,
    selectableCount: 0,
  });
  const [finalFilteredTableData, setFinalFilteredTableData] = useState<IStakingInfo>({
    tableData: [],
    calculatedApy: 0,
    selectableCount: 0,
  });

  // memo
  const strategyOptions = useMemo(() => {
    // while advanced option is on, no strategy options is available
    if (advancedOption.advanced) {
      return [];
    } else {
      // while using basic mode, we use strategy in the list below
      return [
        { label: 'Low risk', value: Strategy.LOW_RISK },
        { label: 'High APY', value: Strategy.HIGH_APY },
        { label: 'Decentralization', value: Strategy.DECENTRAL },
        { label: '1KV validators', value: Strategy.ONE_KV },
      ];
    }
  }, [advancedOption.advanced]);

  const walletBalance = useMemo(() => {
    if (selectedAccount) {
      return selectedAccount.balance;
    } else {
      return '(please select a wallet)';
    }
  }, [selectedAccount]);

  const networkDisplayDOM = useMemo(() => {
    if (networkCapitalCodeName(networkName) === NetworkCodeName.KSM) {
      return (
        <>
          <KSMLogo />
          <LogoTitle>KSM</LogoTitle>
        </>
      );
    } else {
      return (
        <>
          <DOTLogo />
          <LogoTitle>DOT</LogoTitle>
        </>
      );
    }
  }, [networkName]);

  const notifyWarn = useCallback((msg: string) => {
    toast.warn(`${msg}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
  }, []);

  useEffect(() => {
    // while advanced option is on, we use custom filter setting as their own strategy
    if (advancedOption.advanced) {
      setInputData((prev) => ({ ...prev, strategy: ADVANCED_DEFAULT_STRATEGY }));
      setAdvancedSetting(StrategyConfig.CUSTOM);
      setApiParams((prev) => ({
        network: prev.network,
      }));
    } else {
      // while using basic mode, we use strategy with default filter setting as strategy
      // and default is 'low risk' strategy
      setInputData((prev) => ({ ...prev, strategy: BASIC_DEFAULT_STRATEGY }));
      setAdvancedSetting(StrategyConfig.LOW_RISK);
      setApiParams((prev) => ({
        network: prev.network,
        has_verified_identity: true,
        has_telemetry: true,
      }));
    }
  }, [advancedOption.advanced]);

  const columns = useMemo(() => {
    return [
      {
        Header: 'Select',
        accessor: 'select',
        maxWidth: 150,
        Cell: ({ value, row, rows }) => {
          return (
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                let tempTableData = finalFilteredTableData;
                if (tempTableData.tableData[row.index].select) {
                  // unselect
                  tempTableData.tableData[row.index].select = false;
                  tempTableData.selectableCount =
                    tempTableData.selectableCount !== undefined
                      ? (tempTableData.selectableCount += 1)
                      : tempTableData.selectableCount;
                  tempTableData = apyCalculation(tempTableData.tableData, tempTableData.selectableCount);
                  setFinalFilteredTableData(tempTableData);
                } else {
                  // select
                  if (tempTableData.selectableCount !== undefined && tempTableData.selectableCount > 0) {
                    tempTableData.tableData[row.index].select = true;
                    tempTableData.selectableCount -= 1;
                    tempTableData = apyCalculation(tempTableData.tableData, tempTableData.selectableCount);
                    setFinalFilteredTableData(tempTableData);
                  } else {
                    notifyWarn('maximum nomination has reached.');
                  }
                }
              }}
            >
              {value ? <HandTrue /> : <HandFalse />}
            </span>
          );
        },
      },
      {
        Header: 'Account',
        accessor: 'account',
        Cell: ({ value }) => <Account address={value} display={value} />,
      },
      { Header: 'Self Stake', accessor: 'selfStake', collapse: true },
      {
        Header: 'Era Inclusion',
        accessor: 'eraInclusion',
        collapse: true,
        Cell: ({ value }) => {
          // 25.00%  [ 21/84 ]
          return <EraInclusion rate={value.rate} activeCount={value.activeCount} total={value.total} />;
        },
      },
      {
        Header: 'Unclaimed Eras',
        accessor: 'unclaimedEras',
        collapse: true,
        Cell: ({ value, row, rows, toggleRowExpanded }) => {
          let renderComponent: Object[] = [];
          if (Array.isArray(value)) {
            for (let idx = 0; idx < 84; idx++) {
              if (idx < value.length) {
                if (value[idx] === eraStatus.active) {
                  renderComponent.push(<Era statusCode={eraStatus.active} />);
                } else if (value[idx] === eraStatus.inactive) {
                  renderComponent.push(<Era statusCode={eraStatus.inactive} />);
                } else {
                  renderComponent.push(<Era statusCode={eraStatus.unclaimed} />);
                }
              } else {
                renderComponent.push(<Era statusCode={eraStatus.inactive} />);
              }
            }
          } else {
            renderComponent = value;
          }

          return (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  display: 'block',
                  overFlow: 'hidden',
                },
                onClick: () => {
                  const expandedRow = rows.find((row) => row.isExpanded);

                  if (expandedRow) {
                    const isSubItemOfRow = Boolean(expandedRow && row.id.split('.')[0] === expandedRow.id);

                    if (isSubItemOfRow) {
                      const expandedSubItem = expandedRow.subRows.find((subRow) => subRow.isExpanded);

                      if (expandedSubItem) {
                        const isClickedOnExpandedSubItem = expandedSubItem.id === row.id;
                        if (!isClickedOnExpandedSubItem) {
                          toggleRowExpanded(expandedSubItem.id, false);
                        }
                      }
                    } else {
                      toggleRowExpanded(expandedRow.id, false);
                    }
                  }
                  row.toggleRowExpanded();
                },
              })}
            >
              {renderComponent}
            </span>
          );
        },
      },
      {
        Header: 'Avg APY',
        accessor: 'avgAPY',
        collapse: true,
        Cell: ({ value }) => {
          return <div>{(value * 100).toFixed(1)}</div>;
        },
      },
      {
        Header: 'Active',
        accessor: 'active',
        collapse: true,
        Cell: ({ value }) => <span>{value ? <CheckTrue /> : <CheckFalse />}</span>,
      },
    ];
  }, [finalFilteredTableData]);

  const handleAdvancedOptionChange = useCallback(
    (optionName) => (checked) => {
      switch (optionName) {
        case 'advanced':
          setAdvancedOption((prev) => ({ ...prev, advanced: checked }));
          break;
        case 'supportus':
          setAdvancedOption((prev) => ({ ...prev, supportus: checked }));
          break;
        default:
          break;
      }
    },
    []
  );

  /**
   * for Header, option toggle
   */
  const handleOptionToggle = useCallback((visible) => {
    setAdvancedOption((prev) => ({ ...prev, toggle: visible }));
  }, []);

  /**
   * handle strategy change,
   * while strategy changing, advanced filter and api parameter also need to be changed
   * to its corresponding setting/configuration
   */
  const handleStrategyChange = (e: IStrategy) => {
    console.log('current strategy: ', e);

    switch (e.value) {
      case Strategy.LOW_RISK:
        setAdvancedSetting(StrategyConfig.LOW_RISK);
        setApiParams((prev) => ({
          network: prev.network,
          has_verified_identity: true,
          has_telemetry: true,
        }));
        break;
      case Strategy.HIGH_APY:
        setAdvancedSetting(StrategyConfig.HIGH_APY);
        setApiParams((prev) => ({
          network: prev.network,
        }));
        break;
      case Strategy.DECENTRAL:
        setAdvancedSetting(StrategyConfig.DECENTRAL);
        setApiParams((prev) => ({
          network: prev.network,
          has_verified_identity: true,
        }));
        break;
      case Strategy.ONE_KV:
        setAdvancedSetting(StrategyConfig.ONE_KV);
        setApiParams((prev) => ({
          network: prev.network,
          has_joined_1kv: true,
        }));
        break;
    }

    setInputData((prev) => ({ ...prev, strategy: e }));
  };

  /**
   * handle user input for stake amount and reward destination
   */
  const handleInputChange = (name) => (e) => {
    let tmpValue;
    switch (name) {
      case 'stakeAmount':
        if (!isNaN(e.target.value)) {
          tmpValue = e.target.value;
          // TODO: deal with input number format and range
        } else {
          // not a number
          return;
        }
        break;
      case 'rewardDestination':
        tmpValue = e;
        break;
      default:
        // stakeAmount
        tmpValue = e.target.value;
        break;
    }
    setInputData((prev) => ({ ...prev, [name]: tmpValue }));
  };

  /**
   * handle advanced filter changing,
   */
  const handleAdvancedFilter = (name) => (e) => {
    // TODO: input validator, limit
    console.log('filter change: ', e);
    if (e && e.target && e.target.value) {
      console.log('filter change: ', e.target.value);
    }

    switch (name) {
      case 'maxCommission':
        setApiParams((prev) => ({
          ...prev,
          commission_max: Number(e.target.value) / 100,
        }));
        setAdvancedSetting((prev) => ({ ...prev, maxCommission: e.target.value }));
        break;
      case 'identity':
        setApiParams((prev) => ({
          ...prev,
          has_verified_identity: e,
        }));
        setAdvancedSetting((prev) => ({ ...prev, identity: e }));
        break;
      case 'maxUnclaimedEras':
        setAdvancedSetting((prev) => ({ ...prev, maxUnclaimedEras: e.target.value }));
        break;
      case 'previousSlashes':
        setAdvancedSetting((prev) => ({ ...prev, previousSlashes: e }));
        break;
      case 'isSubIdentity':
        setAdvancedSetting((prev) => ({ ...prev, isSubIdentity: e }));
        break;
      case 'historicalApy':
        setApiParams((prev) => ({
          ...prev,
          apy_min: Number(e.target.value) / 100,
        }));
        setAdvancedSetting((prev) => ({ ...prev, historicalApy: e.target.value }));
        break;
      case 'minInclusion':
        setAdvancedSetting((prev) => ({ ...prev, minInclusion: e.target.value }));
        break;
      case 'telemetry':
        setApiParams((prev) => ({
          ...prev,
          has_telemetry: e,
        }));
        setAdvancedSetting((prev) => ({ ...prev, telemetry: e }));
        break;
      case 'highApy':
        setAdvancedSetting((prev) => ({ ...prev, highApy: e }));
        break;
      case 'decentralized':
        setAdvancedSetting((prev) => ({ ...prev, decentralized: e }));
        break;
      case 'oneKv':
        setApiParams((prev) => ({
          ...prev,
          has_joined_1kv: e,
        }));
        setAdvancedSetting((prev) => ({ ...prev, oneKv: e }));
        break;
      default:
        break;
    }
  };

  const handleValidatorStrategy = useCallback(
    (data: IValidator[]): IStakingInfo => {
      switch (inputData.strategy.value) {
        case Strategy.LOW_RISK:
          return lowRiskStrategy(data, advancedOption.supportus, networkName);
        case Strategy.HIGH_APY:
          return highApyStrategy(data, advancedOption.supportus, networkName);
        case Strategy.DECENTRAL:
          return decentralStrategy(data, advancedOption.supportus, networkName);
        case Strategy.ONE_KV:
          return oneKvStrategy(data, advancedOption.supportus, networkName);
        case Strategy.CUSTOM:
          return customStrategy(data, advancedOption.supportus, networkName);
        default:
          return { tableData: [], calculatedApy: 0 };
      }
    },
    [inputData.strategy.value, advancedOption.supportus, networkName]
  );

  // while network changing, set api parameter for network
  useEffect(() => {
    setApiParams((prev) => ({
      ...prev,
      network: networkCapitalCodeName(networkName),
    }));
  }, [networkName]);

  /**
   *  while network changing or api status changes to ready, or query parameter are changing, trigger the api
   * to get the new list
   */
  useEffect(() => {
    let tempId = Math.round(Math.random() * 100);
    const validatorAxiosSource = axios.CancelToken.source();
    (async () => {
      if (networkStatus === NetworkStatus.READY) {
        try {
          console.log('========== API Launch ==========', tempId);
          setApiLoading(true);
          let result = await apiGetAllValidator({
            params: apiParams.network,
            query: { ...apiParams },
            cancelToken: validatorAxiosSource.token,
          });
          console.log('========== API RETURN ==========', tempId);
          setApiFilteredTableData(handleValidatorStrategy(result));
        } catch (error) {
          console.log('error: ', error);
        }
      } else {
        setApiLoading(true);
      }
    })();
    return () => {
      if (networkStatus === NetworkStatus.READY) {
        console.log('========== API CANCEL ==========', tempId);
        validatorAxiosSource.cancel(`apiGetAllValidator req CANCEL ${tempId}`);
      }
    };
  }, [networkStatus, apiParams, handleValidatorStrategy]);

  /**
   * user changing the advanced setting mannually, we set the new api query parameter
   */
  useEffect(() => {
    if (advancedOption.advanced) {
      // is in advanced mode, need advanced filtered
      const filteredResult = advancedConditionFilter(
        {
          maxUnclaimedEras: advancedSetting.maxUnclaimedEras,
          previousSlashes: advancedSetting.previousSlashes,
          isSubIdentity: advancedSetting.isSubIdentity,
          minInclusion: advancedSetting.minInclusion,
          highApy: advancedSetting.highApy,
          decentralized: advancedSetting.decentralized,
        },
        apiFilteredTableData,
        advancedOption.supportus,
        networkName
      );
      console.log('filterResult: ', filteredResult);
      setFinalFilteredTableData(filteredResult);
      setApiLoading(false);
    }
  }, [
    advancedSetting.maxUnclaimedEras,
    advancedSetting.previousSlashes,
    advancedSetting.isSubIdentity,
    advancedSetting.minInclusion,
    advancedSetting.highApy,
    advancedSetting.decentralized,
    apiFilteredTableData,
    advancedOption.advanced,
    advancedOption.supportus,
    networkName,
  ]);

  /**
   * user changing the advanced setting mannually, we set the new api query parameter
   */
  useEffect(() => {
    if (!advancedOption.advanced) {
      // is in basic mode, no further filtered needed, we handle it in each strategy filter already
      setFinalFilteredTableData(apiFilteredTableData);
      setApiLoading(false);
    }
  }, [apiFilteredTableData, advancedOption.advanced]);

  const advancedSettingDOM = useMemo(() => {
    if (!advancedOption.advanced) {
      return null;
    }
    return (
      <>
        <div style={{ height: 17 }}></div>
        <AdvancedBlockWrap>
          <AdvancedBlock style={{ backgroundColor: '#2E3843', height: 'auto' }}>
            <ContentColumnLayout width="100%" justifyContent="flex-start">
              <ContentBlockTitle color="white">Advanced Setting</ContentBlockTitle>
              <AdvancedSettingWrap>
                <TitleInput
                  title="Max. Commission"
                  placeholder="input maximum amount"
                  inputLength={170}
                  value={advancedSetting.maxCommission}
                  onChange={handleAdvancedFilter('maxCommission')}
                />
                <TitleInput
                  title="Max. Unclaimed Eras"
                  placeholder="input maximum amount"
                  inputLength={170}
                  value={advancedSetting.maxUnclaimedEras}
                  onChange={handleAdvancedFilter('maxUnclaimedEras')}
                />
                <TitleInput
                  title="Historical APY"
                  placeholder="0 - 100"
                  unit="%"
                  value={advancedSetting.historicalApy}
                  onChange={handleAdvancedFilter('historicalApy')}
                />
                <TitleInput
                  title="Min. Eras Inclusion Rate"
                  placeholder="0 - 100"
                  unit="%"
                  value={advancedSetting.minInclusion}
                  onChange={handleAdvancedFilter('minInclusion')}
                />
                <TitleSwitch
                  title="Identity"
                  checked={advancedSetting.identity}
                  onChange={handleAdvancedFilter('identity')}
                />
                <TitleSwitch
                  title="Prev. Slashes"
                  checked={advancedSetting.previousSlashes}
                  onChange={handleAdvancedFilter('previousSlashes')}
                />
                <TitleSwitch
                  title="Is Sub-Identity"
                  checked={advancedSetting.isSubIdentity}
                  onChange={handleAdvancedFilter('isSubIdentity')}
                />
                {/* <TitleSwitch
                  title="Is Telemeterable"
                  checked={advancedSetting.telemetry}
                  onChange={handleAdvancedFilter('telemetry')}
                /> */}
                <TitleSwitch
                  title="Highest Avg.APY"
                  checked={advancedSetting.highApy}
                  onChange={handleAdvancedFilter('highApy')}
                />
                <TitleSwitch
                  title="Decentralized"
                  checked={advancedSetting.decentralized}
                  onChange={handleAdvancedFilter('decentralized')}
                />
                <TitleSwitch
                  title="1kv programme"
                  checked={advancedSetting.oneKv}
                  onChange={handleAdvancedFilter('oneKv')}
                />
              </AdvancedSettingWrap>
            </ContentColumnLayout>
          </AdvancedBlock>
        </AdvancedBlockWrap>
      </>
    );
  }, [
    advancedOption.advanced,
    advancedSetting.maxCommission,
    advancedSetting.maxUnclaimedEras,
    advancedSetting.historicalApy,
    advancedSetting.minInclusion,
    advancedSetting.identity,
    advancedSetting.previousSlashes,
    advancedSetting.isSubIdentity,
    advancedSetting.highApy,
    advancedSetting.decentralized,
    advancedSetting.oneKv,
  ]);

  const advancedFilterResult = useMemo(() => {
    if (!advancedOption.advanced) {
      return null;
    }
    return (
      <>
        <div style={{ height: 17 }}></div>
        <AdvancedBlockWrap>
          <AdvancedFilterBlock style={{ backgroundColor: '#2E3843', height: 'auto' }}>
            <ContentColumnLayout width="100%" justifyContent="flex-start">
              <ContentBlockTitle color="white">Filter results: </ContentBlockTitle>
              {!apiLoading ? (
                <Table
                  type={tableType.stake}
                  columns={columns}
                  data={finalFilteredTableData.tableData}
                  pagination
                />
              ) : (
                <ScaleLoader />
              )}
            </ContentColumnLayout>
          </AdvancedFilterBlock>
        </AdvancedBlockWrap>
      </>
    );
  }, [advancedOption.advanced, columns, apiLoading, finalFilteredTableData]);

  return (
    <>
      <CardHeader
        Header={() => (
          <StakingHeader
            advancedOption={advancedOption}
            optionToggle={handleOptionToggle}
            onChange={handleAdvancedOptionChange}
          />
        )}
      >
        <ContentBlockWrap advanced={advancedOption.advanced}>
          <ContentBlock>
            <ContentBlockLeft>{networkDisplayDOM}</ContentBlockLeft>
            <ContentBlockRight>
              <Balance>Balance: {walletBalance}</Balance>
              <Input
                style={{ width: '80%' }}
                onChange={handleInputChange('stakeAmount')}
                value={inputData.stakeAmount}
              />
            </ContentBlockRight>
          </ContentBlock>
          <ArrowContainer advanced={advancedOption.advanced}>
            <GreenArrow />
          </ArrowContainer>
          <ContentBlock>
            <ContentBlockLeft>
              <ContentColumnLayout>
                <ContentBlockTitle>Strategy</ContentBlockTitle>
                <DropdownCommon
                  style={{ flex: 1, width: '90%' }}
                  options={strategyOptions}
                  value={inputData.strategy}
                  onChange={handleStrategyChange}
                  disabled={advancedOption.advanced ? true : false}
                />
                <ContentBlockFooter />
              </ContentColumnLayout>
            </ContentBlockLeft>
            <ContentBlockRight>
              <Balance>Calculated APY</Balance>
              {!apiLoading ? (
                <ValueStyle>{(finalFilteredTableData.calculatedApy * 100).toFixed(1)}%</ValueStyle>
              ) : (
                <ScaleLoader />
              )}
            </ContentBlockRight>
          </ContentBlock>
        </ContentBlockWrap>
        <div style={{ height: 17 }}></div>
        <RewardBlockWrap advanced={advancedOption.advanced}>
          <RewardBlock
            advanced={advancedOption.advanced}
            style={{ backgroundColor: '#2E3843', height: 'auto' }}
          >
            <ContentColumnLayout width="100%" justifyContent="flex-start">
              <ContentBlockTitle color="white">Reward Destination</ContentBlockTitle>
              <DestinationWrap advanced={advancedOption.advanced}>
                <RewardComponent advanced={advancedOption.advanced} marginTop={5}>
                  <DropdownCommon
                    style={{
                      flex: 1,
                      width: '100%',
                    }}
                    options={[
                      { label: 'Specified payment account', value: 0, isDisabled: true },
                      { label: 'wallet 001', value: 1 },
                      { label: 'wallet 002', value: 2 },
                    ]}
                    value={inputData.rewardDestination}
                    onChange={handleInputChange('rewardDestination')}
                    theme="dark"
                  />
                </RewardComponent>
                <RewardComponent advanced={advancedOption.advanced}>
                  <Node title="CONTROLLER-HSINCHU" address="GiCAS2RKmFajjJNvc39rMRc83hMhg0BgT…" />
                </RewardComponent>
              </DestinationWrap>
              <ContentBlockFooter style={{ minHeight: advancedOption.advanced ? 0 : 50 }} />
            </ContentColumnLayout>
          </RewardBlock>
        </RewardBlockWrap>
        {advancedSettingDOM}
        {advancedFilterResult}
        <FooterLayout>
          <div style={{ marginBottom: 12 }}>
            {!apiLoading ? (
              <Button
                title="Nominate"
                onClick={() => {
                  console.log('Nominate');
                }}
                style={{ width: 220 }}
              />
            ) : (
              <ScaleLoader />
            )}
          </div>
          <Warning msg="There is currently an ongoing election for new validator candidates. As such staking operations are not permitted." />
        </FooterLayout>
      </CardHeader>
      <DashboardLayout>
        <TimeCircle type="epoch" percentage={68} />
        <TimeCircle type="era" percentage={75} />
      </DashboardLayout>
    </>
  );
};

export default Staking;

const ContentBlock = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 14px 25px 14px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  width: 570px;
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

interface ContentBlockWrapProps {
  advanced: Boolean;
}
const ContentBlockWrap = styled.div<ContentBlockWrapProps>`
  display: flex;
  flex-direction: ${(props) => (props.advanced ? 'row' : 'column')};
  justify-content: space-between;
  align-items: center;
  width: ${(props) => (props.advanced ? '1200px' : '620px')};
  @media (max-width: 1395px) {
    flex-wrap: ${(props) => (props.advanced ? 'wrap' : 'nowrap')};
    flex-direction: column;
    width: 620px;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 100px);
  }
`;

interface RewardBlockProps {
  advanced: Boolean;
}
const RewardBlock = styled.div<RewardBlockProps>`
  background-color: white;
  border-radius: 6px;
  padding: 14px 25px 14px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  width: ${(props) => (props.advanced ? '100%' : '570px')};
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

interface RewardBlockWrapProps {
  advanced: Boolean;
}
const RewardBlockWrap = styled.div<RewardBlockWrapProps>`
  display: flex;
  flex-direction: ${(props) => (props.advanced ? 'row' : 'column')};
  justify-content: space-between;
  align-items: center;
  width: ${(props) => (props.advanced ? '1200px' : '620px')};
  @media (max-width: 1395px) {
    width: 620px;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 110px);
  }
`;

interface RewardComponentProps {
  advanced: Boolean;
  marginTop?: number;
}
const RewardComponent = styled.div<RewardComponentProps>`
  width: ${(props) => (props.advanced ? '535px' : '100%')};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
  @media (max-width: 720px) {
    width: 100%;
  }
`;

interface DestinationWrapProps {
  advanced: Boolean;
}
const DestinationWrap = styled.div<DestinationWrapProps>`
  display: flex;
  flex-direction: ${(props) => (props.advanced ? 'row' : 'column')};
  justify-content: space-between;
  align-items: center;
  width: ${(props) => (props.advanced ? '100%' : '570px')};
  @media (max-width: 1395px) {
    flex-wrap: ${(props) => (props.advanced ? 'wrap' : 'nowrap')};
    flex-direction: column;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

const ContentBlockLeft = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const LogoTitle = styled.div`
  padding-left: 18px;
  display: flex;
  flex-shrink: 1;
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
`;

const Balance = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
`;

type ContentColumnLayoutProps = {
  justifyContent?: string;
  width?: string;
};
const ContentColumnLayout = styled.div<ContentColumnLayoutProps>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.justifyContent ? props.justifyContent : 'space-between')};
  align-items: flex-start;
  width: ${(props) => (props.width ? props.width : '90%')};
`;
const ContentBlockTitle = styled.div`
  flex: 1;
  color: ${(props) => (props.color ? props.color : '#17222d')};
  min-height: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  margin-left: -8px;
`;

type ContentBlockFooterProps = {
  minHeight?: string;
};
const ContentBlockFooter = styled.div<ContentBlockFooterProps>`
  flex-grow: 1;
  color: blue;
  width: 100%;
  min-height: ${(props) => (props.minHeight ? props.minHeight : '16px')};
`;

const ContentBlockRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
`;

const ValueStyle = styled.div`
  font-family: Montserrat;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  color: #23beb9;
`;

const FooterLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 40.5px;
  padding: 14px 25px 14px 25px;
  width: 570px;
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

const DashboardLayout = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 32px;
`;

interface ArrowContainerProps {
  advanced: Boolean;
}
const ArrowContainer = styled.div<ArrowContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
  transform: ${(props) => (props.advanced ? 'rotate(-90deg)' : '')};
  transition-duration: 0.2s;
  @media (max-width: 1340px) {
    transform: rotate(0deg);
  }
`;

const AdvancedSettingWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
`;

const AdvancedBlock = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 14px 25px 14px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  max-width: 100%;
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

const AdvancedFilterBlock = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 14px 25px 14px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  width: 100%;
  @media (max-width: 1395px) {
    width: 570px;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

interface RewardBlockWrapProps {
  advanced: Boolean;
}
const AdvancedBlockWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 1200px;
  @media (max-width: 1395px) {
    width: 620px;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 110px);
  }
`;
