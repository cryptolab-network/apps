import React, { useEffect, useState, useMemo, useCallback, useContext, useRef } from 'react';
import styled from 'styled-components';
import CardHeader from '../../../components/Card/CardHeader';
import Input from '../../../components/Input';
import DropdownCommon from '../../../components/Dropdown/Common';
import Node from '../../../components/Node';
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
import { ReactComponent as WNDLogo } from '../../../assets/images/wnd-logo.svg';
import { ReactComponent as GreenArrow } from '../../../assets/images/green-arrow.svg';
import { ReactComponent as HandTrue } from '../../../assets/images/hand-up-true.svg';
import { ReactComponent as HandFalse } from '../../../assets/images/hand-up-false.svg';
import { ReactComponent as CheckTrue } from '../../../assets/images/check-true.svg';
import { ReactComponent as CheckFalse } from '../../../assets/images/check-false.svg';
import { eraStatus } from '../../../utils/status/Era';
import { tableType } from '../../../utils/status/Table';
import { networkCapitalCodeName } from '../../../utils/parser';
import { hasValues } from '../../../utils/helper';
import { apiGetAllValidator } from '../../../apis/Validator';
import { ApiContext } from '../../../components/Api';
import StakingHeader from './Header';
import { ApiState } from '../../../components/Api';
import { NetworkCodeName, NetworkConfig } from '../../../utils/constants/Network';
import {
  formatToStakingInfo,
  lowRiskStrategy,
  highApyStrategy,
  decentralStrategy,
  oneKvStrategy,
  advancedConditionFilter,
  apyCalculation,
} from './utils';
import axios from 'axios';
import { toast, ToastOptions } from 'react-toastify';
import { ApiPromise } from '@polkadot/api';
import { balanceUnit } from '../../../utils/string';
import keys from '../../../config/keys';
import { useDebounce } from 'use-debounce';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { EventRecord, ExtrinsicStatus } from '@polkadot/types/interfaces';
import Warning from '../../../components/Hint/Warn';
import '../index.css';

enum Strategy {
  LOW_RISK,
  HIGH_APY,
  DECENTRAL,
  ONE_KV,
  CUSTOM,
}

enum RewardDestinationType {
  NULL,
  STAKED,
  STASH,
  CONTROLLER,
  ACCOUNT,
}

const rewardDestinationOptions = [
  {
    label: '--- Select one ---',
    value: RewardDestinationType.NULL,
    isDisabled: true,
  },
  {
    label: 'Stash account (increase the amount at stake)',
    value: RewardDestinationType.STAKED,
  },
  {
    label: 'Stash account (do not increase the amount at stake)',
    value: RewardDestinationType.STASH,
  },
  {
    label: 'Controller account',
    value: RewardDestinationType.CONTROLLER,
  },
  // {
  //   label: 'Specified payment account',
  //   value: RewardDestinationType.ACCOUNT,
  // },
];

enum AccountRole {
  VALIDATOR,
  CONTROLLER_OF_VALIDATOR,
  CONTROLLER_OF_NOMINATOR,
  NOMINATOR,
  NOMINATOR_AND_CONTROLLER,
  NONE,
}
interface IStrategy {
  label: string;
  value: Strategy;
}

interface IAccountChainInfo {
  role: AccountRole;
  controller: string | undefined;
  validators: string[];
  rewardDestination: RewardDestinationType;
  rewardDestinationAddress: string | null;
  bonded: string;
  redeemable: string;
  isNominatable: boolean;
  isReady: boolean;
}

// session and epoch are same.
export interface IEraInfo {
  activeEra: number;
  activeEraStart: number;
  currentEra: number;
  currentSessionIndex: number;
  eraLength: number;
  eraProgress: number;
  isEpoch: boolean;
  sessionLength: number;
  sessionPerEra: number;
}

export interface IAdvancedSetting {
  minSelfStake: string | null; // input amount
  // maxCommission?: string | null; // input amount
  identity?: boolean; // switch
  maxUnclaimedEras?: string | null; // input amount
  noPreviousSlashes?: boolean; // switch
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
  display: string;
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
    isVerified: boolean;
  };
  blockNomination: boolean;
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

interface INomitableInfo {
  nominatable: boolean;
  warning: any;
}

const StrategyConfig = {
  LOW_RISK: {
    minSelfStake: '',
    identity: true, // switch
    maxUnclaimedEras: '16', // input amount
    noPreviousSlashes: false, // switch
    isSubIdentity: false, // switch
    historicalApy: '', // input %
    minInclusion: '', // input %
    telemetry: true, // switch
    highApy: false, // switch
    decentralized: false, // switch
    oneKv: false, // switch
  },
  HIGH_APY: {
    minSelfStake: '',
    identity: false, // switch
    maxUnclaimedEras: '', // input amount
    noPreviousSlashes: true, // switch
    isSubIdentity: false, // switch
    historicalApy: '', // input %
    minInclusion: '', // input %
    telemetry: false, // switch
    highApy: true, // switch
    decentralized: false, // switch
    oneKv: false, // switch
  },
  DECENTRAL: {
    minSelfStake: '',
    identity: true, // switch
    maxUnclaimedEras: '', // input amount
    noPreviousSlashes: false, // switch
    isSubIdentity: false, // switch
    historicalApy: '', // input %
    minInclusion: '', // input %
    telemetry: false, // switch
    highApy: false, // switch
    decentralized: true, // switch
    oneKv: false, // switch
  },
  ONE_KV: {
    minSelfStake: '',
    identity: false, // switch
    maxUnclaimedEras: '', // input amount
    noPreviousSlashes: false, // switch
    isSubIdentity: false, // switch
    historicalApy: '', // input %
    minInclusion: '', // input %
    telemetry: false, // switch
    highApy: false, // switch
    decentralized: false, // switch
    oneKv: true, // switch
  },
  CUSTOM: {
    minSelfStake: '',
    identity: false, // switch
    maxUnclaimedEras: '', // input amount
    noPreviousSlashes: false, // switch
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

const queryStakingInfo = async (address, api: ApiPromise) => {
  const [info, ledger] = await Promise.all([
    api.derive.staking.account(address),
    api.query.staking.ledger(address),
  ]);

  const rewardDestination = info.rewardDestination.isStaked
    ? RewardDestinationType.STAKED
    : info.rewardDestination.isStash
    ? RewardDestinationType.STASH
    : info.rewardDestination.isController
    ? RewardDestinationType.CONTROLLER
    : RewardDestinationType.ACCOUNT;
  const rewardDestinationAddress =
    rewardDestination === RewardDestinationType.ACCOUNT ? info.rewardDestination.asAccount.toString() : null;

  let role;
  let isNominatable = false;
  let bonded;
  let validators;
  if (info.nextSessionIds.length !== 0) {
    role = AccountRole.VALIDATOR;
    bonded = info.stakingLedger.total.unwrap().toHex();
    validators = info.nominators.map((n) => n.toHuman());
    console.log(`role = VALIDATOR`);
  } else if (!info.stakingLedger.total.unwrap().isZero()) {
    if (info.controllerId?.toHuman() === address) {
      role = AccountRole.NOMINATOR_AND_CONTROLLER;
      bonded = info.stakingLedger.total.unwrap().toHex();
      validators = info.nominators.map((n) => n.toHuman());
      console.log(`role = NOMINATOR_AND_CONTROLLER`);
      isNominatable = true;
    } else {
      role = AccountRole.NOMINATOR;
      bonded = info.stakingLedger.total.unwrap().toHex();
      validators = info.nominators.map((n) => n.toHuman());
      console.log(`role = NOMINATOR`);
    }
  } else if (!ledger.isNone) {
    const stash = ledger.unwrap().stash.toHuman();
    const staking = await api.derive.staking.account(stash);
    if (staking.nextSessionIds.length !== 0) {
      role = AccountRole.CONTROLLER_OF_VALIDATOR;
      bonded = staking.stakingLedger.total.unwrap().toHex();
      validators = staking.nominators.map((n) => n.toHuman());
      console.log(`role = CONTROLLER_OF_VALIDATOR`);
    } else {
      role = AccountRole.CONTROLLER_OF_NOMINATOR;
      bonded = staking.stakingLedger.total.unwrap().toHex();
      validators = staking.nominators.map((n) => n.toHuman());
      console.log(`role = CONTROLLER_OF_NOMINATOR`);
      isNominatable = true;
    }
  } else {
    role = AccountRole.NONE;
    bonded = info.stakingLedger.total.unwrap().toHex();
    validators = info.nominators.map((n) => n.toHuman());
    console.log(`role = NONE`);
    isNominatable = true;
  }

  return {
    role,
    controller: info.controllerId?.toHuman(),
    validators,
    rewardDestination,
    rewardDestinationAddress,
    bonded,
    redeemable: info.redeemable ? info.redeemable.toHex() : '0',
    isNominatable,
    isReady: true,
  };
};

const queryEraInfo = async (api: ApiPromise): Promise<IEraInfo> => {
  const {
    activeEra,
    activeEraStart,
    currentEra,
    eraLength,
    eraProgress,
    isEpoch,
    sessionLength,
    sessionsPerEra,
  } = await api.derive.session.progress();
  return {
    activeEra: activeEra.toNumber(),
    activeEraStart: activeEraStart.unwrap().toNumber(),
    currentEra: currentEra.toNumber(),
    currentSessionIndex: eraProgress.divRound(sessionLength).toNumber(),
    eraLength: eraLength.toNumber(),
    eraProgress: eraProgress.toNumber(),
    isEpoch: isEpoch,
    sessionLength: sessionLength.toNumber(),
    sessionPerEra: sessionsPerEra.toNumber(),
  };
};

const queryNominatorLimits = async (api: ApiPromise) => {
  const [maxNominatorsCount, minNominatorBond, counterForNominators] = await Promise.all([
    api.query.staking.maxNominatorsCount(),
    api.query.staking.minNominatorBond(),
    api.query.staking.counterForNominators(),
  ]);

  return {
    maxNominatorsCount,
    minNominatorBond,
    counterForNominators,
  };
};

interface IOptions {
  label: string;
  value: Strategy | RewardDestinationType;
  isDisabled?: boolean;
}
interface IInputData {
  stakeAmount: number;
  strategy: IOptions;
  rewardDestination: IOptions | null;
  paymentAccount?: string;
}

enum StrategyType {
  Common = 'common',
  OneKv = '1kv',
}

const Staking = () => {
  // context
  let {
    network: networkName,
    api: polkadotApi,
    apiState: networkStatus,
    selectedAccount,
    refreshAccountData,
  } = useContext(ApiContext);
  // state
  const [inputData, setInputData] = useState<IInputData>({
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
    network: keys.defaultNetwork,
  });
  const [apiLoading, setApiLoading] = useState(true);
  const [apiOriginTableData, setApiOriginTableData] = useState<IStakingInfo>({
    tableData: [],
    calculatedApy: 0,
    selectableCount: 0,
  });
  const [finalFilteredTableData, setFinalFilteredTableData] = useState<IStakingInfo>({
    tableData: [],
    calculatedApy: 0,
    selectableCount: 0,
  });
  const [accountChainInfo, setAccountChainInfo] = useState<IAccountChainInfo>({
    isReady: false,
  } as unknown as IAccountChainInfo);
  const [eraInfo, setEraInfo] = useState<IEraInfo>();
  const [minNominatorBond, setMinNominatorBond] = useState<string>('');

  const [advancedSettingDebounceVal] = useDebounce(advancedSetting, 1000);

  const strategyRef = useRef(StrategyType.Common);

  const _formatBalance = useCallback(
    (value: string = '0') => {
      return balanceUnit(networkName, value, true);
    },
    [networkName]
  );

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
      return _formatBalance(selectedAccount?.balances?.totalBalance);
    } else {
      return '(please select a wallet)';
    }
  }, [_formatBalance, selectedAccount]);

  const networkDisplayDOM = useMemo(() => {
    if (networkCapitalCodeName(networkName) === NetworkCodeName.KSM) {
      return (
        <>
          <KSMLogo />
          <LogoTitle>KSM</LogoTitle>
        </>
      );
    } else if (networkCapitalCodeName(networkName) === NetworkCodeName.DOT) {
      return (
        <>
          <DOTLogo />
          <LogoTitle>DOT</LogoTitle>
        </>
      );
    } else {
      return (
        <>
          <WNDLogo />
          <LogoTitle>WND</LogoTitle>
        </>
      );
    }
  }, [networkName]);

  const eraInfoDisplayDom = useMemo(() => {
    if (eraInfo) {
      return (
        <>
          <TimeCircle type="epoch" eraInfo={eraInfo} network={networkName} />
          <TimeCircle type="era" eraInfo={eraInfo} network={networkName} />
        </>
      );
    } else {
      return <></>;
    }
  }, [eraInfo, networkName]);

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

  const notifyInfo = useCallback((msg: string | React.ReactElement) => {
    const options: ToastOptions = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    };

    if (typeof msg === 'string') {
      toast.info(`${msg}`, options);
    } else {
      toast.info(msg, options);
    }
  }, []);

  const notifySuccess = useCallback((msg: string) => {
    toast.success(`${msg}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      onClose: () => {
        toast.dismiss();
      },
    });
  }, []);

  const notifyFailed = useCallback((msg: string) => {
    toast.error(`${msg}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      onClose: () => {
        toast.dismiss();
      },
    });
  }, []);

  const notifyProcessing = useCallback((msg: string) => {
    toast.success(`${msg}`, {
      position: 'top-right',
      autoClose: 30000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
  }, []);

  const txStatusCallback = useCallback(
    ({ events = [], status }: { events?: EventRecord[]; status: ExtrinsicStatus }) => {
      if (status.isInvalid) {
        console.log('Transaction invalid');
        notifyWarn('Transaction invalid');
      } else if (status.isReady) {
        console.log('Transaction is ready');
        notifyInfo('Transaction is ready');
      } else if (status.isBroadcast) {
        console.log('Transaction has been broadcasted');
        notifyInfo(<div>Transaction has been broadcasted</div>);
      } else if (status.isInBlock) {
        console.log('Transaction is included in block');
        notifyInfo('Transaction is included in block');
      } else if (status.isFinalized) {
        const blockHash = status.asFinalized.toHex();
        console.log(`Transaction is included in block ${blockHash}`);
        notifyInfo(
          <div>
            Transaction has been included in <br />
            blockHash {blockHash.substring(0, 9)}...
            {blockHash.substring(blockHash.length - 8, blockHash.length)}
          </div>
        );
        events.forEach(({ event }) => {
          if (event.method === 'ExtrinsicSuccess') {
            console.log('Transaction succeeded');
            notifySuccess('Transaction succeeded');
          } else if (event.method === 'ExtrinsicFailed') {
            console.log('Transaction failed');
            notifyFailed('Transaction failed');
          }
        });
        // update account data
        setAccountChainInfo((prev) => ({ ...prev, isReady: false }));
        queryStakingInfo(selectedAccount.address, polkadotApi).then(setAccountChainInfo).catch(console.error);
        refreshAccountData(selectedAccount);
      }
    },
    [notifyWarn, notifyInfo, selectedAccount, polkadotApi, refreshAccountData, notifySuccess, notifyFailed]
  );

  useEffect(() => {}, []);

  useEffect(() => {
    // while advanced option is on, we use custom filter setting as their own strategy
    if (advancedOption.advanced) {
      setInputData((prev) => ({ ...prev, strategy: ADVANCED_DEFAULT_STRATEGY }));
      setAdvancedSetting(StrategyConfig.CUSTOM);
    } else {
      // while using basic mode, we use strategy with default filter setting as strategy
      // and default is 'low risk' strategy
      setInputData((prev) => ({ ...prev, strategy: BASIC_DEFAULT_STRATEGY }));
      setAdvancedSetting(StrategyConfig.LOW_RISK);
    }
  }, [advancedOption.advanced]);

  useEffect(() => {
    if (hasValues(selectedAccount) === true && networkStatus === ApiState.READY) {
      setAccountChainInfo((prev) => ({ ...prev, isReady: false }));
      queryStakingInfo(selectedAccount.address, polkadotApi)
        .then((info) => {
          setAccountChainInfo(info);
          setInputData((prev) => ({
            ...prev,
            rewardDestination: rewardDestinationOptions[info.rewardDestination],
          }));
        })
        .catch(console.error);
    }
  }, [selectedAccount, networkStatus, setAccountChainInfo, polkadotApi, setInputData]);

  useEffect(() => {
    if (networkStatus === ApiState.READY) {
      queryEraInfo(polkadotApi).then(setEraInfo).catch(console.error);
    }
  }, [networkStatus, networkName, polkadotApi]);

  useEffect(() => {
    if (networkStatus === ApiState.READY) {
      queryNominatorLimits(polkadotApi)
        .then((data) => {
          setMinNominatorBond(data.minNominatorBond.toHex());
        })
        .catch(console.error);
    }
  }, [networkName, networkStatus, polkadotApi, setMinNominatorBond]);

  const nominatableInfo = useMemo((): INomitableInfo => {
    if (networkStatus !== ApiState.READY) {
      return {
        nominatable: false,
        warning: (
          <Warning
            msg={`Your have disconnected to ${networkName} network, please wait a moment or refresh the page.`}
          />
        ),
      };
    }

    if (apiLoading) {
      return {
        nominatable: false,
        warning: <Warning msg="Validator list is fetching. As such staking operations are not permitted." />,
      };
    }

    if (finalFilteredTableData.tableData.length <= 0) {
      return {
        nominatable: false,
        warning: (
          <Warning msg="The filtered validator count is 0. As such staking operations are not permitted." />
        ),
      };
    }

    if (finalFilteredTableData.tableData.filter((data) => data.select === true).length <= 0) {
      return {
        nominatable: false,
        warning: (
          <Warning msg="You haven't selected any validators yet. As such staking operations are not permitted." />
        ),
      };
    }

    if (!accountChainInfo.isReady) {
      return {
        nominatable: false,
        warning: <Warning msg="On-chain data is fetching. As such staking operations are not permitted." />,
      };
    }

    if (!accountChainInfo.isNominatable) {
      let msg =
        'This account cannot operate staking related extrinsics. As such staking operations are not permitted.';
      switch (accountChainInfo.role) {
        case AccountRole.VALIDATOR:
          msg = "This account's role is Validator. As such staking operations are not permitted.";
          break;
        case AccountRole.CONTROLLER_OF_VALIDATOR:
          msg =
            "This account's role is Controller of Validator. As such staking operations are not permitted.";
          break;
        case AccountRole.NOMINATOR:
          msg =
            "This account's role is Nominator which has a Controller account. As such staking operations are not permitted.";
          break;
      }
      return {
        nominatable: false,
        warning: <Warning msg={msg} />,
      };
    }

    if (accountChainInfo.role === AccountRole.VALIDATOR) {
      return {
        nominatable: false,
        warning: (
          <Warning msg="This account's role is Validator. As such staking operations are not permitted." />
        ),
      };
    }

    return {
      nominatable: true,
      warning: null,
    };
  }, [
    networkStatus,
    apiLoading,
    finalFilteredTableData.tableData,
    accountChainInfo.isReady,
    accountChainInfo.isNominatable,
    accountChainInfo.role,
    networkName,
  ]);

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
                let tempTableData = { ...finalFilteredTableData };
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
        sortType: 'basic',
      },
      {
        Header: 'Account',
        accessor: 'account',
        Cell: ({ value, row }) => <Account address={value} display={row.original.display} />,
        sortType: 'basic',
      },
      {
        Header: 'Self Stake',
        accessor: 'selfStake',
        collapse: true,
        Cell: ({ value }) => {
          return <span>{_formatBalance(value)}</span>;
        },
        sortType: 'basic',
      },
      {
        Header: 'Era Inclusion',
        accessor: 'eraInclusion',
        collapse: true,
        Cell: ({ value }) => {
          // 25.00%  [ 21/84 ]
          return <EraInclusion rate={value.rate} activeCount={value.activeCount} total={value.total} />;
        },
        sortType: 'basic',
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
        sortType: 'basic',
      },
      {
        Header: 'Avg APY',
        accessor: 'avgAPY',
        collapse: true,
        Cell: ({ value }) => {
          return <div>{(value * 100).toFixed(1)}</div>;
        },
        sortType: 'basic',
      },
      {
        Header: 'Active',
        accessor: 'active',
        collapse: true,
        Cell: ({ value }) => <span>{value ? <CheckTrue /> : <CheckFalse />}</span>,
        sortType: 'basic',
      },
    ];
  }, [finalFilteredTableData, notifyWarn, _formatBalance]);

  const handleAdvancedOptionChange = useCallback(
    (optionName) => (checked) => {
      switch (optionName) {
        case 'advanced':
          setAdvancedOption((prev) => ({ ...prev, advanced: checked }));
          if (strategyRef.current !== StrategyType.Common) {
            setApiParams((prev) => ({
              network: prev.network,
            }));
            strategyRef.current = StrategyType.Common;
          }
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

  const renderRewardDestinationNode = useMemo(() => {
    switch (inputData.rewardDestination?.value) {
      case RewardDestinationType.STAKED:
        return <Node title={selectedAccount.name} address={selectedAccount.address} />;
      case RewardDestinationType.STASH:
        return <Node title={selectedAccount.name} address={selectedAccount.address} />;
      case RewardDestinationType.CONTROLLER:
        // todo: Jack
        if (accountChainInfo?.controller) {
          return <Node title={'Controller'} address={accountChainInfo?.controller} />;
        } else {
          return <Node title={'controller account'} address="enter an address" />;
        }
      case RewardDestinationType.ACCOUNT:
        // todo: Jack
        return <Node title={'Account'} address="enter an address" />;
      default:
        return <></>;
    }
  }, [inputData, accountChainInfo, selectedAccount]);

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
    console.log('strategy ref: ', strategyRef);
    switch (e.value) {
      case Strategy.LOW_RISK:
        setAdvancedSetting(StrategyConfig.LOW_RISK);
        if (strategyRef.current !== StrategyType.Common) {
          setApiParams((prev) => ({
            network: prev.network,
          }));
          strategyRef.current = StrategyType.Common;
        }
        break;
      case Strategy.HIGH_APY:
        setAdvancedSetting(StrategyConfig.HIGH_APY);
        if (strategyRef.current !== StrategyType.Common) {
          setApiParams((prev) => ({
            network: prev.network,
          }));
          strategyRef.current = StrategyType.Common;
        }

        break;
      case Strategy.DECENTRAL:
        setAdvancedSetting(StrategyConfig.DECENTRAL);
        if (strategyRef.current !== StrategyType.Common) {
          setApiParams((prev) => ({
            network: prev.network,
          }));
          strategyRef.current = StrategyType.Common;
        }
        break;
      case Strategy.ONE_KV:
        setAdvancedSetting(StrategyConfig.ONE_KV);
        if (strategyRef.current !== StrategyType.OneKv) {
          setApiParams((prev) => ({
            network: prev.network,
            has_joined_1kv: true,
          }));
          strategyRef.current = StrategyType.OneKv;
        }
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
          // input unit is KSM
          const input = BigInt(tmpValue * Math.pow(10, NetworkConfig[networkName].decimals));
          const transferrable = BigInt(selectedAccount.balances.availableBalance);
          const bonded = accountChainInfo ? BigInt(accountChainInfo.bonded) : BigInt(0);
          const minBonded = BigInt(minNominatorBond);
          if (input > transferrable + bonded || input < minBonded) {
            console.log(`input value should be <= transferrable and >= minBonded`);
          }
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
    switch (name) {
      case 'minSelfStake':
        setAdvancedSetting((prev) => ({ ...prev, minSelfStake: e.target.value }));
        break;
      case 'identity':
        setAdvancedSetting((prev) => ({ ...prev, identity: e }));
        break;
      case 'maxUnclaimedEras':
        setAdvancedSetting((prev) => ({ ...prev, maxUnclaimedEras: e.target.value }));
        break;
      case 'noPreviousSlashes':
        setAdvancedSetting((prev) => ({ ...prev, noPreviousSlashes: e }));
        break;
      case 'isSubIdentity':
        setAdvancedSetting((prev) => ({ ...prev, isSubIdentity: e }));
        break;
      case 'historicalApy':
        setAdvancedSetting((prev) => ({ ...prev, historicalApy: e.target.value }));
        break;
      case 'minInclusion':
        setAdvancedSetting((prev) => ({ ...prev, minInclusion: e.target.value }));
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
    (data: IStakingInfo, isSupportUs: boolean, networkName: string): IStakingInfo => {
      switch (inputData.strategy.value) {
        case Strategy.LOW_RISK:
          return lowRiskStrategy(data, isSupportUs, networkName, accountChainInfo.validators);
        case Strategy.HIGH_APY:
          return highApyStrategy(data, isSupportUs, networkName, accountChainInfo.validators);
        case Strategy.DECENTRAL:
          return decentralStrategy(data, isSupportUs, networkName, accountChainInfo.validators);
        case Strategy.ONE_KV:
          return oneKvStrategy(data, isSupportUs, networkName, accountChainInfo.validators);
        default:
          return { tableData: [], calculatedApy: 0 };
      }
    },
    [inputData.strategy.value, accountChainInfo.validators]
  );

  /**
   * handle nominate transaction
   */
  const handleNominate = useCallback(async () => {
    console.log('Nominate');

    if (!accountChainInfo) {
      console.log('no account chain info');
      return;
    }

    const limits = await queryNominatorLimits(polkadotApi);
    const maxNominatorsCount = limits.maxNominatorsCount.isEmpty
      ? 0
      : parseInt(limits.maxNominatorsCount.toString());
    const minNominatorBond = parseInt(limits.minNominatorBond.toString());
    const counterForNominators = parseInt(limits.counterForNominators.toString());
    const stakeAmount = BigInt(inputData.stakeAmount * Math.pow(10, NetworkConfig[networkName].decimals));
    const bonded = BigInt(accountChainInfo.bonded);
    const transferrable = BigInt(selectedAccount.balances.availableBalance);

    // checks
    if (counterForNominators >= maxNominatorsCount) {
      console.log(`not allow to nominate, because hit maxNominatorsCount ${maxNominatorsCount}`);
      return;
    }

    if (
      accountChainInfo?.role === AccountRole.VALIDATOR ||
      accountChainInfo?.role === AccountRole.CONTROLLER_OF_VALIDATOR ||
      accountChainInfo?.role === AccountRole.NOMINATOR
    ) {
      console.log(`not allow to nominate, role is ${accountChainInfo.role}`);
      return;
    }

    if (stakeAmount < minNominatorBond) {
      console.log(
        `not allow to nominate, the input stake amount ${stakeAmount} should be great than minNominatorBond ${minNominatorBond}`
      );
      return;
    }

    if (stakeAmount > bonded + transferrable) {
      console.log(
        `not allow to nominate, the input stake amount should be less than transferrable ${
          bonded + transferrable
        }`
      );
      return;
    }

    const selectedValidators = finalFilteredTableData.tableData.filter((v) => v.select);
    console.log(selectedValidators);
    console.log(selectedValidators.length);

    if (selectedValidators.length === 0) {
      console.log(`not allow to nominate, selected validators should greater than zero.`);
      return;
    }

    if (selectedValidators.length > NetworkConfig[networkName].maxNominateCount) {
      console.log(
        `not allow to nominate, selected validators should be less than ${NetworkConfig[networkName].maxNominateCount}`
      );
      return;
    }

    if (inputData.rewardDestination === null) {
      console.log(`not allow to nominate, reward destination is null`);
      return;
    }

    // reward destination
    console.log(inputData.rewardDestination.value);
    let payee;
    switch (inputData.rewardDestination.value) {
      case RewardDestinationType.STAKED:
        payee = 'Staked';
        break;
      case RewardDestinationType.STASH:
        payee = 'Stash';
        break;
      case RewardDestinationType.CONTROLLER:
        // todo, change to input controller address
        payee = 'Controller';
        break;
      case RewardDestinationType.ACCOUNT:
        payee = accountChainInfo.rewardDestinationAddress;
        break;
      default:
        payee = null;
    }

    let txs;
    let txFee;
    switch (accountChainInfo.role) {
      case AccountRole.NONE:
        txs = [
          polkadotApi.tx.staking.bond(selectedAccount.address, stakeAmount, payee),
          polkadotApi.tx.staking.nominate(selectedValidators.map((v) => v.account)),
        ];

        txFee = await polkadotApi.tx.utility.batch(txs).paymentInfo(selectedAccount.address);

        console.log(`
            class=${txFee.class.toString()},
            weight=${txFee.weight.toString()},
            partialFee=${txFee.partialFee.toHuman()}
          `);

        break;
      case AccountRole.NOMINATOR_AND_CONTROLLER:
        {
          const extraBondAmount = stakeAmount - bonded;
          if (inputData.rewardDestination.value === accountChainInfo.rewardDestination) {
            txs = [
              polkadotApi.tx.staking.bondExtra(extraBondAmount),
              polkadotApi.tx.staking.nominate(selectedValidators.map((v) => v.account)),
            ];
          } else {
            txs = [
              polkadotApi.tx.staking.setPayee(payee),
              polkadotApi.tx.staking.bondExtra(extraBondAmount),
              polkadotApi.tx.staking.nominate(selectedValidators.map((v) => v.account)),
            ];
          }

          const txFee = await polkadotApi.tx.utility.batch(txs).paymentInfo(selectedAccount.address);
          console.log(`
            class=${txFee.class.toString()},
            weight=${txFee.weight.toString()},
            partialFee=${txFee.partialFee.toHuman()}
          `);
        }
        break;
      case AccountRole.CONTROLLER_OF_NOMINATOR:
        {
          if (inputData.rewardDestination.value === accountChainInfo.rewardDestination) {
            txs = [polkadotApi.tx.staking.nominate(selectedValidators.map((v) => v.account))];
          } else {
            txs = [
              polkadotApi.tx.staking.setPayee(payee),
              polkadotApi.tx.staking.nominate(selectedValidators.map((v) => v.account)),
            ];
          }
          const txFee = await polkadotApi.tx.utility.batch(txs).paymentInfo(selectedAccount.address);
          console.log(`
            class=${txFee.class.toString()},
            weight=${txFee.weight.toString()},
            partialFee=${txFee.partialFee.toHuman()}
          `);
        }
        break;
    }

    // finds an injector for an address
    const injector = await web3FromAddress(selectedAccount.address);

    // ready to sign and send tx
    notifyProcessing('Trasaction is processing ');
    polkadotApi.tx.utility
      .batch(txs)
      .signAndSend(selectedAccount.address, { signer: injector.signer }, txStatusCallback)
      .catch((err) => {
        console.log(err);
        toast.dismiss();
        notifyWarn('Transaction is cancelled');
      });
  }, [
    accountChainInfo,
    polkadotApi,
    inputData.stakeAmount,
    inputData.rewardDestination,
    networkName,
    selectedAccount.balances.availableBalance,
    selectedAccount.address,
    finalFilteredTableData.tableData,
    notifyProcessing,
    txStatusCallback,
    notifyWarn,
  ]);

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
      if (networkStatus === ApiState.READY) {
        try {
          console.log('========== API Launch ==========', tempId);
          setApiLoading(true);
          let result = await apiGetAllValidator({
            params: apiParams.network,
            query: { ...apiParams },
            cancelToken: validatorAxiosSource.token,
          });
          console.log('========== API RETURN ==========', tempId);
          setApiOriginTableData(formatToStakingInfo(result, networkName));
          setApiLoading(false);
        } catch (error) {
          console.log('error: ', error);
        }
      } else {
        setApiLoading(true);
      }
    })();
    return () => {
      if (networkStatus === ApiState.READY) {
        console.log('========== API CANCEL ==========', tempId);
        validatorAxiosSource.cancel(`apiGetAllValidator req CANCEL ${tempId}`);
      }
    };
  }, [networkStatus, apiParams, networkName]);

  /**
   * user changing the advanced setting mannually, we set the new api query parameter
   */
  useEffect(() => {
    let filteredResult: IStakingInfo;
    if (advancedOption.advanced) {
      // is in advanced mode, need advanced filtered
      filteredResult = advancedConditionFilter(
        {
          minSelfStake: advancedSettingDebounceVal.minSelfStake,
          maxUnclaimedEras: advancedSettingDebounceVal.maxUnclaimedEras,
          historicalApy: advancedSettingDebounceVal.historicalApy,
          minInclusion: advancedSettingDebounceVal.minInclusion,
          identity: advancedSettingDebounceVal.identity,
          noPreviousSlashes: advancedSettingDebounceVal.noPreviousSlashes,
          isSubIdentity: advancedSettingDebounceVal.isSubIdentity,
          highApy: advancedSettingDebounceVal.highApy,
          decentralized: advancedSettingDebounceVal.decentralized,
        },
        apiOriginTableData,
        advancedOption.supportus,
        networkName,
        accountChainInfo.validators
      );
    } else {
      filteredResult = handleValidatorStrategy(apiOriginTableData, advancedOption.supportus, networkName);
    }
    setFinalFilteredTableData(filteredResult);
  }, [
    advancedSettingDebounceVal.maxUnclaimedEras,
    advancedSettingDebounceVal.noPreviousSlashes,
    advancedSettingDebounceVal.isSubIdentity,
    advancedSettingDebounceVal.minInclusion,
    advancedSettingDebounceVal.highApy,
    advancedSettingDebounceVal.decentralized,
    apiOriginTableData,
    advancedOption.advanced,
    advancedOption.supportus,
    networkName,
    advancedSettingDebounceVal.historicalApy,
    advancedSettingDebounceVal.identity,
    handleValidatorStrategy,
    advancedSettingDebounceVal.minSelfStake,
    accountChainInfo.validators,
  ]);

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
                  disabled={apiLoading}
                  title="Min. Self Stake"
                  placeholder="input minimum amount"
                  inputLength={170}
                  value={advancedSetting.minSelfStake}
                  onChange={handleAdvancedFilter('minSelfStake')}
                />
                <TitleInput
                  disabled={apiLoading}
                  title="Max. Unclaimed Eras"
                  placeholder="input maximum amount"
                  inputLength={170}
                  value={advancedSetting.maxUnclaimedEras}
                  onChange={handleAdvancedFilter('maxUnclaimedEras')}
                />
                <TitleInput
                  disabled={apiLoading}
                  title="Historical APY"
                  placeholder="0 - 100"
                  unit="%"
                  value={advancedSetting.historicalApy}
                  onChange={handleAdvancedFilter('historicalApy')}
                />
                <TitleInput
                  disabled={apiLoading}
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
                  disabled={apiLoading}
                  title="No Prev. Slashes"
                  checked={advancedSetting.noPreviousSlashes}
                  onChange={handleAdvancedFilter('noPreviousSlashes')}
                />
                <TitleSwitch
                  disabled={apiLoading}
                  title="Is Sub-Identity"
                  checked={advancedSetting.isSubIdentity}
                  onChange={handleAdvancedFilter('isSubIdentity')}
                />
                <TitleSwitch
                  disabled={apiLoading}
                  title="Highest Avg.APY"
                  checked={advancedSetting.highApy}
                  onChange={handleAdvancedFilter('highApy')}
                />
                <TitleSwitch
                  disabled={apiLoading}
                  title="Decentralized"
                  checked={advancedSetting.decentralized}
                  onChange={handleAdvancedFilter('decentralized')}
                />
                <TitleSwitch
                  disabled={apiLoading}
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
    apiLoading,
    advancedSetting.minSelfStake,
    advancedSetting.maxUnclaimedEras,
    advancedSetting.historicalApy,
    advancedSetting.minInclusion,
    advancedSetting.identity,
    advancedSetting.noPreviousSlashes,
    advancedSetting.isSubIdentity,
    advancedSetting.highApy,
    advancedSetting.decentralized,
    advancedSetting.oneKv,
  ]);

  const filterResultInfo = useMemo(() => {
    let selectedValidatorsCount = finalFilteredTableData.tableData.filter(
      (data) => data.select === true
    ).length;
    let filterValidatorsCount = finalFilteredTableData.tableData.length;
    let totalValidatorsCount = apiOriginTableData.tableData.length;

    return (
      <div>
        <FilterInfo style={{ color: '#20aca8' }}>selected: {selectedValidatorsCount}</FilterInfo>
        <span>|</span>
        <FilterInfo>filtered: {filterValidatorsCount}</FilterInfo>
        <span>|</span>
        <FilterInfo>total: {totalValidatorsCount}</FilterInfo>
      </div>
    );
  }, [apiOriginTableData.tableData.length, finalFilteredTableData.tableData]);

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
              <ContentBlockTitle color="white">Filter results{filterResultInfo}</ContentBlockTitle>
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
  }, [advancedOption.advanced, columns, apiLoading, finalFilteredTableData.tableData, filterResultInfo]);

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
          <BalanceContextBlock>
            {/* <DetailedBalance color='white'>Role: {accountChainInfo?.role}</DetailedBalance> */}
            <DetailedBalance color="white">Nominees: {accountChainInfo?.validators?.length}</DetailedBalance>
            <DetailedBalance color="white">
              bonded: {_formatBalance(accountChainInfo?.bonded)}
            </DetailedBalance>
            <DetailedBalance color="white">
              transferrable: {_formatBalance(selectedAccount?.balances?.availableBalance)}
            </DetailedBalance>
            <DetailedBalance color="white">
              reserved: {_formatBalance(selectedAccount?.balances?.reservedBalance)}
            </DetailedBalance>
            <DetailedBalance color="white">
              redeemable: {_formatBalance(accountChainInfo?.redeemable)}
            </DetailedBalance>
          </BalanceContextBlock>
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
                    options={rewardDestinationOptions}
                    value={inputData.rewardDestination}
                    onChange={handleInputChange('rewardDestination')}
                    theme="dark"
                  />
                </RewardComponent>
                <RewardComponent advanced={advancedOption.advanced}>
                  {renderRewardDestinationNode}
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
            <Button
              disabled={!nominatableInfo.nominatable}
              title="Nominate"
              onClick={handleNominate}
              style={{ width: 220 }}
            />
          </div>
          {nominatableInfo.warning}
        </FooterLayout>
      </CardHeader>
      <DashboardLayout>{eraInfoDisplayDom}</DashboardLayout>
    </>
  );
};

export default Staking;

const ContentBlock = styled.div`
  background-color: white;
  border-radius: 6px 6px 0px 0px;
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

const BalanceContextBlock = styled.div`
  background-color: #0b0d13;
  border-radius: 0px 0px 6px 6px;
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
  align-content: space-between;
  flex-wrap: wrap;
  padding: 25px;
  height: 62px;
  width: 570px;
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

type BalanceProps = {
  color?: string;
};

const DetailedBalance = styled.div<BalanceProps>`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  color: ${(props) => (props.color ? props.color : 'black')};
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

const Balance = styled.div<BalanceProps>`
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

const FilterInfo = styled.span`
  margin: 0 16px 0 16px;
`;
