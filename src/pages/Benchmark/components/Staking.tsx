import React, { useEffect, useState, useMemo, useCallback, useContext, useRef } from 'react';
import type { Option } from '@polkadot/types';
import type { StakingLedger as PolkadotStakingLedger } from '@polkadot/types/interfaces/staking';
import { useLocation } from 'react-router-dom';
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
import TinyButton from '../../../components/Button/tiny';
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
import { hasValues, isEmpty } from '../../../utils/helper';
import {
  apiGetAllValidator,
  apiNominate,
  apiNominated,
  apiRefKeyVerify,
  IValidator,
  apiRefKeyDecode,
} from '../../../apis/Validator';
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
  resetSelected,
  stakeAmountValidate,
  IStakeAmountValidateType,
} from './utils';
import axios from 'axios';
import { toast, ToastOptions } from 'react-toastify';
import { ApiPromise } from '@polkadot/api';
import { balanceUnit, shortenStashId } from '../../../utils/string';
import { getCandidateNumber } from '../../../utils/constants/Validator';
import keys from '../../../config/keys';
import { useDebounce } from 'use-debounce';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { EventRecord, ExtrinsicStatus } from '@polkadot/types/interfaces';
import Warning from '../../../components/Hint/Warn';
import '../index.css';
import ReactTooltip from 'react-tooltip';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';

export enum Strategy {
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
  stash: string | undefined;
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
  refStashId?: string | undefined; // url query string
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
    unclaimedEras: {
      era: number[];
      status: number[];
    };
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

interface IQueryParse {
  advanced: string;
  refKey: string;
  signature: string;
  switchNetwork: string;
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
  let location = useLocation();
  const { t } = useTranslation();

  const BASIC_DEFAULT_STRATEGY = useMemo(() => {
    return {
      label: t('benchmark.staking.strategy.lowRisk'),
      value: Strategy.LOW_RISK,
    };
  }, [t]);
  const ADVANCED_DEFAULT_STRATEGY = useMemo(() => {
    return { label: t('benchmark.staking.strategy.custom'), value: Strategy.CUSTOM };
  }, [t]);
  // context
  let {
    network: networkName,
    api: polkadotApi,
    apiState: networkStatus,
    selectedAccount,
    refreshAccountData,
    hasWeb3Injected,
    validatorCache,
    oneKValidatorCache,
    cacheValidators,
    changeNetwork,
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
  // const [extraBalanceInfoVisible, setExtraBalanceInfoVisible] = useState<boolean>(true);
  const [isAccountInfoLoading, setIsAccountInfoLoading] = useState(true);

  const [customPageSize, setCustomPageSize] = useState(20);

  const [nominating, setNominating] = useState(false);

  const [refStashId, setRefStashId] = useState<string | undefined>(undefined);

  const [advancedSettingDebounceVal] = useDebounce(advancedSetting, 1000);

  const strategyRef = useRef(StrategyType.Common);

  const _formatBalance = useCallback(
    (value: string = '0') => {
      return balanceUnit(networkName, value, true, false);
    },
    [networkName]
  );

  const displayRole = useCallback(
    (role: AccountRole): string => {
      switch (role) {
        case AccountRole.VALIDATOR:
          return t('benchmark.staking.displayRole.validator');
        case AccountRole.CONTROLLER_OF_VALIDATOR:
          return t('benchmark.staking.displayRole.controller');
        case AccountRole.CONTROLLER_OF_NOMINATOR:
          return t('benchmark.staking.displayRole.controller');
        case AccountRole.NOMINATOR:
          return t('benchmark.staking.displayRole.nominator');
        case AccountRole.NOMINATOR_AND_CONTROLLER:
          return t('benchmark.staking.displayRole.nominator');
        case AccountRole.NONE:
          return t('benchmark.staking.displayRole.none');
        default:
          return '';
      }
    },
    [t]
  );

  const rewardDestinationOptions = useMemo(() => {
    const options = [
      {
        label: t('benchmark.staking.rewardsDestination.selectOne'),
        value: RewardDestinationType.NULL,
        isDisabled: true,
      },
      {
        label: t('benchmark.staking.rewardsDestination.staked'),
        value: RewardDestinationType.STAKED,
      },
      {
        label: t('benchmark.staking.rewardsDestination.stash'),
        value: RewardDestinationType.STASH,
      },
      {
        label: t('benchmark.staking.rewardsDestination.controller'),
        value: RewardDestinationType.CONTROLLER,
      },
      // {
      //   label: 'Specified payment account',
      //   value: RewardDestinationType.ACCOUNT,
      // },
    ];
    return options;
  }, [t]);

  // memo
  const strategyOptions = useMemo(() => {
    // while advanced option is on, no strategy options is available
    if (advancedOption.advanced) {
      return [];
    } else {
      // while using basic mode, we use strategy in the list below
      return [
        { label: t('benchmark.staking.strategy.lowRisk'), value: Strategy.LOW_RISK },
        { label: t('benchmark.staking.strategy.highApy'), value: Strategy.HIGH_APY },
        { label: t('benchmark.staking.strategy.decentralized'), value: Strategy.DECENTRAL },
        { label: t('benchmark.staking.strategy.onekv'), value: Strategy.ONE_KV },
      ];
    }
  }, [advancedOption.advanced, t]);

  const walletBalance = useMemo(() => {
    if (selectedAccount) {
      return _formatBalance(selectedAccount?.balances?.totalBalance);
    } else {
      return t('benchmark.staking.selectWallet');
    }
  }, [_formatBalance, selectedAccount, t]);

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

  const queryStakingInfo = useCallback(async (address, api: ApiPromise) => {
    const [info, ledger] = await Promise.all([
      api.derive.staking.account(address),
      api.query.staking.ledger<Option<PolkadotStakingLedger>>(address),
    ]);

    let rewardDestination = info.rewardDestination.isStaked
      ? RewardDestinationType.STAKED
      : info.rewardDestination.isStash
      ? RewardDestinationType.STASH
      : info.rewardDestination.isController
      ? RewardDestinationType.CONTROLLER
      : RewardDestinationType.ACCOUNT;
    let rewardDestinationAddress =
      rewardDestination === RewardDestinationType.ACCOUNT
        ? info.rewardDestination.asAccount.toString()
        : null;

    let role;
    let isNominatable = false;
    let bonded;
    let validators;
    let stash;
    let controller;
    if (info.nextSessionIds.length !== 0) {
      role = AccountRole.VALIDATOR;
      bonded = info.stakingLedger.active.unwrap().toHex();
      validators = info.nominators.map((n) => n.toHuman());
      stash = info.stashId.toHuman();
      controller = info.controllerId?.toHuman();
    } else if (!info.stakingLedger.active.unwrap().isZero()) {
      if (info.controllerId?.toHuman() === address) {
        role = AccountRole.NOMINATOR_AND_CONTROLLER;
        bonded = info.stakingLedger.active.unwrap().toHex();
        validators = info.nominators.map((n) => n.toHuman());
        stash = info.stashId.toHuman();
        controller = info.controllerId?.toHuman();
        isNominatable = true;
      } else {
        role = AccountRole.NOMINATOR;
        bonded = info.stakingLedger.active.unwrap().toHex();
        validators = info.nominators.map((n) => n.toHuman());
        stash = info.stashId.toHuman();
        controller = info.controllerId?.toHuman();
      }
    } else if (!ledger.isNone) {
      controller = address;
      stash = ledger.unwrap().stash.toHuman();
      const staking = await api.derive.staking.account(stash);
      rewardDestination = staking.rewardDestination.isStaked
        ? RewardDestinationType.STAKED
        : staking.rewardDestination.isStash
        ? RewardDestinationType.STASH
        : staking.rewardDestination.isController
        ? RewardDestinationType.CONTROLLER
        : RewardDestinationType.ACCOUNT;
      rewardDestinationAddress =
        rewardDestination === RewardDestinationType.ACCOUNT
          ? info.rewardDestination.asAccount.toString()
          : null;
      if (staking.nextSessionIds.length !== 0) {
        role = AccountRole.CONTROLLER_OF_VALIDATOR;
        bonded = staking.stakingLedger.active.unwrap().toHex();
        validators = staking.nominators.map((n) => n.toHuman());
      } else {
        role = AccountRole.CONTROLLER_OF_NOMINATOR;
        bonded = staking.stakingLedger.active.unwrap().toHex();
        validators = staking.nominators.map((n) => n.toHuman());
        isNominatable = true;
      }
    } else {
      role = AccountRole.NONE;
      bonded = info.stakingLedger.active.unwrap().toHex();
      validators = info.nominators.map((n) => n.toHuman());
      stash = address;
      isNominatable = true;
    }
    setIsAccountInfoLoading(false);
    return {
      role,
      controller,
      stash,
      validators,
      rewardDestination,
      rewardDestinationAddress,
      bonded,
      redeemable: info.redeemable ? info.redeemable.toHex() : '0',
      isNominatable,
      isReady: true,
    };
  }, []);

  const txStatusCallback = useCallback(
    ({ events = [], status }: { events?: EventRecord[]; status: ExtrinsicStatus }) => {
      setIsAccountInfoLoading(true);
      if (status.isInvalid) {
        notifyWarn(t('benchmark.staking.warnings.transactionFailed'));
      } else if (status.isReady) {
        notifyInfo(t('benchmark.staking.warnings.transactionReady'));
      } else if (status.isBroadcast) {
        notifyInfo(<div>{t('benchmark.staking.warnings.transactionBroadcasted')}</div>);
      } else if (status.isInBlock) {
        notifyInfo(t('benchmark.staking.warnings.transactionIsIncluded'));
      } else if (status.isFinalized) {
        const blockHash = status.asFinalized.toHex();

        notifyInfo(
          <div>
            {t('benchmark.staking.warnings.transactionIsIncludedInBlock')} {blockHash.substring(0, 9)}...
            {blockHash.substring(blockHash.length - 8, blockHash.length)}
          </div>
        );
        events.forEach(({ event }) => {
          if (event.method === 'ExtrinsicSuccess') {
            notifySuccess(t('benchmark.staking.warnings.transactionSucceeded'));
          } else if (event.method === 'ExtrinsicFailed') {
            notifyFailed(t('benchmark.staking.warnings.transactionFailed'));
          }
        });
        // update account data
        setAccountChainInfo((prev) => ({ ...prev, isReady: false }));
        queryStakingInfo(selectedAccount.address, polkadotApi).then(setAccountChainInfo).catch(console.error);
        refreshAccountData(selectedAccount);
        setNominating(false);
      }
    },
    [
      notifyWarn,
      t,
      notifyInfo,
      queryStakingInfo,
      selectedAccount,
      polkadotApi,
      refreshAccountData,
      notifySuccess,
      notifyFailed,
      setNominating,
    ]
  );

  useEffect(() => {
    const parsed: IQueryParse = queryString.parse(location.search) as unknown as IQueryParse;
    if (parsed.advanced && parsed.advanced === 'true') {
      setAdvancedOption((prev) => ({ ...prev, advanced: true }));
    } else if (parsed.refKey && parsed.signature && parsed.switchNetwork) {
      (async () => {
        // setAdvancedOption((prev) => ({ ...prev, advanced: true }));
        changeNetwork(parsed.switchNetwork);
        const stashId = await apiRefKeyDecode({ refKey: parsed.refKey });
        const verifyResult = await apiRefKeyVerify({
          params: `${stashId}/${networkCapitalCodeName(networkName)}/verify`,
          data: { refKey: parsed.refKey, encoded: parsed.signature },
        });
        if (verifyResult && stashId) {
          if (networkStatus === ApiState.READY) {
            queryStakingInfo(stashId, polkadotApi)
              .then((info) => {
                if (info.role === AccountRole.VALIDATOR) {
                  setRefStashId(stashId);
                } else if (info.role === AccountRole.CONTROLLER_OF_VALIDATOR) {
                  setRefStashId(info.stash);
                }
              })
              .catch(console.error);
          }
        }
      })();
    }
  }, [
    changeNetwork,
    location,
    networkName,
    selectedAccount.address,
    networkStatus,
    polkadotApi,
    queryStakingInfo,
  ]);

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
  }, [ADVANCED_DEFAULT_STRATEGY, BASIC_DEFAULT_STRATEGY, advancedOption.advanced]);

  useEffect(() => {
    if (hasWeb3Injected && !isEmpty(selectedAccount)) {
      setIsAccountInfoLoading(true);
    } else {
      setIsAccountInfoLoading(false);
    }
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
  }, [
    selectedAccount,
    networkStatus,
    setAccountChainInfo,
    polkadotApi,
    setInputData,
    queryStakingInfo,
    hasWeb3Injected,
    rewardDestinationOptions,
  ]);

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
    const msg =
      t('benchmark.staking.warnings.disconnectedFirst') +
      networkName +
      t('benchmark.staking.warnings.disconnectedSecond');
    if (networkStatus !== ApiState.READY) {
      return {
        nominatable: false,
        warning: <Warning msg={msg} />,
      };
    }

    if (apiLoading) {
      return {
        nominatable: false,
        warning: <Warning msg={t('benchmark.staking.warnings.fetching')} />,
      };
    }

    if (finalFilteredTableData.tableData.length <= 0) {
      return {
        nominatable: false,
        warning: <Warning msg={t('benchmark.staking.warnings.noFilteredValidators')} />,
      };
    }

    if (finalFilteredTableData.tableData.filter((data) => data.select === true).length <= 0) {
      return {
        nominatable: false,
        warning: <Warning msg={t('benchmark.staking.warnings.noSelectedValidators')} />,
      };
    }

    if (!hasWeb3Injected) {
      return {
        nominatable: false,
        warning: <Warning msg={t('benchmark.staking.warnings.installWallet')} />,
      };
    }

    if (isEmpty(selectedAccount)) {
      return {
        nominatable: false,
        warning: <Warning msg={t('benchmark.staking.warnings.noAccount')} />,
      };
    }

    if (!accountChainInfo.isReady) {
      return {
        nominatable: false,
        warning: <Warning msg={t('benchmark.staking.warnings.fetchingStashData')} />,
      };
    }

    if (!accountChainInfo.isNominatable) {
      let msg = t('benchmark.staking.warnings.stashInvalid');
      switch (accountChainInfo.role) {
        case AccountRole.VALIDATOR:
          msg = t('benchmark.staking.warnings.isValidator');
          break;
        case AccountRole.CONTROLLER_OF_VALIDATOR:
          msg = t('benchmark.staking.warnings.isControllerOfValidator');
          break;
        case AccountRole.NOMINATOR:
          msg = t('benchmark.staking.warnings.hasController');
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
        warning: <Warning msg={t('benchmark.staking.warnings.isValidator')} />,
      };
    }

    if (nominating) {
      return {
        nominatable: false,
        warning: <Warning msg={t('benchmark.staking.warnings.nominating')} />,
      };
    }

    return {
      nominatable: true,
      warning: null,
    };
  }, [
    t,
    hasWeb3Injected,
    selectedAccount,
    networkName,
    networkStatus,
    apiLoading,
    finalFilteredTableData.tableData,
    accountChainInfo.isReady,
    accountChainInfo.isNominatable,
    accountChainInfo.role,
    nominating,
  ]);

  const applyAdvancedFilter = useCallback(() => {
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
        accountChainInfo.validators,
        refStashId
      );
      setFinalFilteredTableData(filteredResult);
    }
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
    advancedSettingDebounceVal.minSelfStake,
    accountChainInfo.validators,
    refStashId,
  ]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [finalFilteredTableData, notifyWarn, _formatBalance, networkName]);

  const columns = useMemo(() => {
    return [
      {
        Header: (
          <span
            onClick={() => {
              const candidateNumber = getCandidateNumber(networkName);
              if (
                finalFilteredTableData.selectableCount !== undefined &&
                finalFilteredTableData.selectableCount < candidateNumber
              ) {
                let tempTableData = { ...finalFilteredTableData };
                tempTableData.tableData = resetSelected(tempTableData.tableData);
                tempTableData.selectableCount = getCandidateNumber(networkName);
                tempTableData = apyCalculation(tempTableData.tableData, tempTableData.selectableCount);
                setFinalFilteredTableData(tempTableData);
              } else {
                applyAdvancedFilter();
              }
            }}
          >
            {finalFilteredTableData.selectableCount !== getCandidateNumber(networkName) ? (
              <>
                <ReactTooltip id="HandTrueTip" effect="solid" backgroundColor="#18232f" textColor="#21aca8" />
                <HandTrue data-for="HandTrueTip" data-tip="Unselect all" />
              </>
            ) : (
              <>
                <ReactTooltip
                  id="HandFalseTip"
                  effect="solid"
                  backgroundColor="#18232f"
                  textColor="#21aca8"
                />
                <HandFalse data-for="HandFalseTip" data-tip="Auto select" />
              </>
            )}
          </span>
        ),
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
                    notifyWarn(t('benchmark.staking.warnings.maxNominations'));
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
        Header: t('benchmark.staking.table.header.account'),
        accessor: 'account',
        Cell: ({ value, row }) => <Account address={value} display={row.original.display} />,
        sortType: 'basic',
      },
      {
        Header: t('benchmark.staking.table.header.selfStake'),
        accessor: 'selfStake',
        collapse: true,
        Cell: ({ value }) => {
          return <span>{_formatBalance(value)}</span>;
        },
        sortType: 'basic',
      },
      {
        Header: t('benchmark.staking.table.header.eraInclusion'),
        accessor: 'eraInclusion',
        collapse: true,
        Cell: ({ value }) => {
          // 25.00%  [ 21/84 ]
          return <EraInclusion rate={value.rate} activeCount={value.activeCount} total={value.total} />;
        },
        sortType: (rowA, rowB, id) => {
          let a = Number(rowA.original[id].rate);
          let b = Number(rowB.original[id].rate);
          if (a > b) return 1;
          if (a < b) return -1;
          return 0;
        },
      },
      {
        Header: t('benchmark.staking.table.header.unclaimedEras'),
        accessor: 'unclaimedEras',
        collapse: true,
        Cell: ({ value, row, rows, toggleRowExpanded }) => {
          let renderComponent: Object[] = [];
          if (value && value.status && value.era) {
            for (let idx = 0; idx < 84; idx++) {
              if (idx < value.status.length) {
                if (value.status[idx] === eraStatus.active) {
                  renderComponent.push(<Era statusCode={eraStatus.active} eraNumber={value.era[idx]} />);
                } else if (value.status[idx] === eraStatus.inactive) {
                  renderComponent.push(<Era statusCode={eraStatus.inactive} eraNumber={value.era[idx]} />);
                } else {
                  renderComponent.push(<Era statusCode={eraStatus.unclaimed} eraNumber={value.era[idx]} />);
                }
              } else {
                renderComponent.push(<Era statusCode={eraStatus.inactive} eraNumber={value.era[idx]} />);
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
                  /* perhape for future usage....
                  const expandedRow = rows.find((row) => row.isExpanded);
                  console.log('row id: ', row.id);

                  if (expandedRow) {
                  console.log('expandedRow: ', expandedRow);
                  const isSubItemOfRow = Boolean(expandedRow && row.id.split('.')[0] === expandedRow.id);

                  if (isSubItemOfRow) {
                  console.log('isSubItemOfRow: ', isSubItemOfRow);
                  const expandedSubItem = expandedRow.subRows.find((subRow) => subRow.isExpanded);

                  if (expandedSubItem) {
                  console.log('expandedSubItem: ', expandedSubItem);
                  const isClickedOnExpandedSubItem = expandedSubItem.id === row.id;
                  if (!isClickedOnExpandedSubItem) {
                    toggleRowExpanded(expandedSubItem.id, false);
                  }
                  }
                  } else {
                  toggleRowExpanded(expandedRow.id, false);
                  }
                  }
                  */
                  row.toggleRowExpanded();
                  const filter = rows.filter((r) => r.isExpanded && r.id === row.id);
                  if (filter.length === 1) {
                    setCustomPageSize((prev) => prev - 1);
                  } else {
                    setCustomPageSize((prev) => prev + 1);
                  }
                },
              })}
              title={null}
            >
              {renderComponent}
            </span>
          );
        },
        sortType: 'basic',
      },
      {
        Header: t('benchmark.staking.table.header.commission') + ' %',
        accessor: 'commission',
        collapse: true,
        Cell: ({ value }) => {
          return <div>{value.toFixed(1)}</div>;
        },
      },
      {
        Header: t('benchmark.staking.table.header.avgApy'),
        accessor: 'avgAPY',
        collapse: true,
        Cell: ({ value }) => {
          return <div>{(value * 100).toFixed(1)}</div>;
        },
        sortType: 'basic',
      },
      {
        Header: t('benchmark.staking.table.header.active'),
        accessor: 'active',
        collapse: true,
        Cell: ({ value }) => <span>{value ? <CheckTrue /> : <CheckFalse />}</span>,
        sortType: 'basic',
      },
    ];
  }, [finalFilteredTableData, networkName, t, applyAdvancedFilter, notifyWarn, _formatBalance]);

  useEffect(() => {
    const defaultValue = localStorage.getItem('supportus');
    if (defaultValue === null || defaultValue === 'false') {
      setAdvancedOption((prev) => ({ ...prev, supportus: false }));
    } else {
      setAdvancedOption((prev) => ({ ...prev, supportus: true }));
    }
  }, []);

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
          localStorage.setItem('supportus', checked);
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
      case RewardDestinationType.STASH:
        if (
          accountChainInfo.role === AccountRole.NOMINATOR ||
          accountChainInfo.role === AccountRole.NOMINATOR_AND_CONTROLLER ||
          accountChainInfo.role === AccountRole.NONE ||
          accountChainInfo.role === AccountRole.VALIDATOR
        ) {
          return <Node title={selectedAccount.name} address={selectedAccount.address} />;
        } else {
          return <Node title={'Stash'} address={accountChainInfo.stash} />;
        }
      case RewardDestinationType.CONTROLLER:
        if (accountChainInfo?.controller) {
          return (
            <Node
              title={t('benchmark.staking.controller.controller')}
              address={accountChainInfo?.controller}
            />
          );
        } else {
          if (accountChainInfo.stash === selectedAccount.address) {
            return <Node title={selectedAccount.name} address={selectedAccount.address} />;
          }
          return <Node title={'Stash'} address={accountChainInfo.stash} />;
        }
      case RewardDestinationType.ACCOUNT:
        // todo: Jack
        return (
          <Node
            title={t('benchmark.staking.controller.account')}
            address={t('benchmark.staking.controller.enterAddress')}
          />
        );
      default:
        return <></>;
    }
  }, [
    inputData.rewardDestination?.value,
    accountChainInfo.role,
    accountChainInfo?.controller,
    accountChainInfo.stash,
    t,
    selectedAccount.name,
    selectedAccount.address,
  ]);

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
        if (!isNaN(e.target.value) && !isEmpty(selectedAccount)) {
          tmpValue = e.target.value;
          // TODO: deal with input number format and range
          // input unit is KSM
          const input = BigInt((tmpValue * Math.pow(10, NetworkConfig[networkName].decimals)).toFixed(0));
          const transferrable = BigInt(selectedAccount.balances.availableBalance);
          const bonded = accountChainInfo ? BigInt(accountChainInfo.bonded) : BigInt(0);
          const minBonded = BigInt(minNominatorBond);
          if (input > transferrable + bonded || input < minBonded) {
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

  const handleBondedClick = useCallback(() => {
    stakeAmountValidate(
      Number(_formatBalance(accountChainInfo?.bonded).split(' ')[0]),
      IStakeAmountValidateType.BONDED,
      notifyWarn
    );
    if (accountChainInfo) {
      setInputData((prev) => ({
        ...prev,
        stakeAmount: Number(_formatBalance(accountChainInfo?.bonded).split(' ')[0]),
      }));
    }
  }, [_formatBalance, notifyWarn, accountChainInfo]);

  const handleMaxClick = useCallback(() => {
    let bonded = Number(_formatBalance(accountChainInfo?.bonded).split(' ')[0]);
    let transferable = Number(_formatBalance(selectedAccount.balances.availableBalance).split(' ')[0]);
    let fee = NetworkConfig[networkName].handlingFee;

    if (stakeAmountValidate(bonded + transferable - fee, IStakeAmountValidateType.STAKEAMOUNT, notifyWarn)) {
      setInputData((prev) => ({
        ...prev,
        stakeAmount: bonded + transferable - fee,
      }));
    }
  }, [_formatBalance, accountChainInfo, networkName, notifyWarn, selectedAccount.balances]);

  const showBondedBtn = useMemo(() => {
    let show = false;
    if (
      accountChainInfo.role === AccountRole.CONTROLLER_OF_NOMINATOR ||
      accountChainInfo.role === AccountRole.NOMINATOR ||
      accountChainInfo.role === AccountRole.NOMINATOR_AND_CONTROLLER
    ) {
      show = true;
    }

    return show;
  }, [accountChainInfo.role]);

  const showMaxBtn = useMemo(() => {
    let show = false;
    if (
      accountChainInfo.role === AccountRole.NOMINATOR ||
      accountChainInfo.role === AccountRole.NOMINATOR_AND_CONTROLLER ||
      accountChainInfo.role === AccountRole.NONE
    ) {
      show = true;
    }

    return show;
  }, [accountChainInfo.role]);

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
          return lowRiskStrategy(data, isSupportUs, networkName, accountChainInfo.validators, refStashId);
        case Strategy.HIGH_APY:
          return highApyStrategy(data, isSupportUs, networkName, accountChainInfo.validators, refStashId);
        case Strategy.DECENTRAL:
          return decentralStrategy(data, isSupportUs, networkName, accountChainInfo.validators, refStashId);
        case Strategy.ONE_KV:
          return oneKvStrategy(data, isSupportUs, networkName, accountChainInfo.validators, refStashId);
        default:
          return { tableData: [], calculatedApy: 0 };
      }
    },
    [inputData.strategy.value, accountChainInfo.validators, refStashId]
  );

  /**
   * handle nominate transaction
   */
  const handleNominate = useCallback(async () => {
    if (!accountChainInfo) {
      notifyWarn('Failed to fetch on-chain data.');
      return;
    }

    const limits = await queryNominatorLimits(polkadotApi);
    const maxNominatorsCount = limits.maxNominatorsCount.isEmpty
      ? 0
      : parseInt(limits.maxNominatorsCount.toString());
    const minNominatorBond = parseInt(limits.minNominatorBond.toString());
    const counterForNominators = parseInt(limits.counterForNominators.toString());
    let stakeAmount = BigInt(
      (inputData.stakeAmount * Math.pow(10, NetworkConfig[networkName].decimals)).toFixed(0)
    );
    const bonded = BigInt(accountChainInfo.bonded);
    // handle tiny number
    const displayBonded = Number(_formatBalance(accountChainInfo.bonded).split(' ')[0]);
    if (inputData.stakeAmount === displayBonded) {
      stakeAmount = bonded;
    }
    const transferrable = BigInt(selectedAccount.balances.availableBalance);

    // checks
    if (counterForNominators >= maxNominatorsCount) {
      notifyWarn('It reaches maximum nominators count.');
      return;
    }

    if (
      accountChainInfo?.role === AccountRole.VALIDATOR ||
      accountChainInfo?.role === AccountRole.CONTROLLER_OF_VALIDATOR ||
      accountChainInfo?.role === AccountRole.NOMINATOR
    ) {
      notifyWarn("This account's role is not allowed to nominate.");
      return;
    }

    if (stakeAmount < minNominatorBond) {
      notifyWarn(`The minimal nominator bond is ${_formatBalance(minNominatorBond.toString())}`);
      return;
    }

    if (stakeAmount > bonded + transferrable) {
      notifyWarn('Not sufficient balance.');
      return;
    }

    if (bonded > 0 && stakeAmount < bonded) {
      notifyWarn('Input amount must be greater than bonded');
      return;
    }

    const selectedValidators = finalFilteredTableData.tableData.filter((v) => v.select);

    if (selectedValidators.length === 0) {
      notifyWarn('No selected validators.');
      return;
    }

    if (selectedValidators.length > NetworkConfig[networkName].maxNominateCount) {
      notifyWarn('Too many selected validators.');
      return;
    }

    if (inputData.rewardDestination === null) {
      notifyWarn('Reward distination is null');
      return;
    }

    // reward destination
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
    // let txFee;
    switch (accountChainInfo.role) {
      case AccountRole.NONE:
        txs = [
          polkadotApi.tx.staking.bond(selectedAccount.address, stakeAmount, payee),
          polkadotApi.tx.staking.nominate(selectedValidators.map((v) => v.account)),
        ];

        // txFee = await polkadotApi.tx.utility.batch(txs).paymentInfo(selectedAccount.address);
        break;
      case AccountRole.NOMINATOR_AND_CONTROLLER:
        const extraBondAmount = stakeAmount - bonded;
        if (inputData.rewardDestination.value === accountChainInfo.rewardDestination) {
          if (extraBondAmount === BigInt(0)) {
            txs = [polkadotApi.tx.staking.nominate(selectedValidators.map((v) => v.account))];
          } else {
            txs = [
              polkadotApi.tx.staking.bondExtra(extraBondAmount),
              polkadotApi.tx.staking.nominate(selectedValidators.map((v) => v.account)),
            ];
          }
        } else {
          if (extraBondAmount === BigInt(0)) {
            txs = [
              polkadotApi.tx.staking.setPayee(payee),
              polkadotApi.tx.staking.nominate(selectedValidators.map((v) => v.account)),
            ];
          } else {
            txs = [
              polkadotApi.tx.staking.setPayee(payee),
              polkadotApi.tx.staking.bondExtra(extraBondAmount),
              polkadotApi.tx.staking.nominate(selectedValidators.map((v) => v.account)),
            ];
          }
        }

        // txFee = await polkadotApi.tx.utility.batch(txs).paymentInfo(selectedAccount.address);
        break;
      case AccountRole.CONTROLLER_OF_NOMINATOR:
        if (inputData.rewardDestination.value === accountChainInfo.rewardDestination) {
          txs = [polkadotApi.tx.staking.nominate(selectedValidators.map((v) => v.account))];
        } else {
          txs = [
            polkadotApi.tx.staking.setPayee(payee),
            polkadotApi.tx.staking.nominate(selectedValidators.map((v) => v.account)),
          ];
        }
        // txFee = await polkadotApi.tx.utility.batch(txs).paymentInfo(selectedAccount.address);
        break;
    }
    setNominating(true);
    // finds an injector for an address
    const injector = await web3FromAddress(selectedAccount.address);

    // ready to sign and send tx
    notifyProcessing('Trasaction is processing ');

    const submittable = polkadotApi.tx.utility.batch(txs);
    submittable
      .signAndSend(selectedAccount.address, { signer: injector.signer }, txStatusCallback)
      .then(() => {
        let strategy;
        switch (inputData.strategy.value) {
          case Strategy.LOW_RISK:
            strategy = Strategy.LOW_RISK;
            break;
          case Strategy.HIGH_APY:
            strategy = Strategy.HIGH_APY;
            break;
          case Strategy.DECENTRAL:
            strategy = Strategy.DECENTRAL;
            break;
          case Strategy.ONE_KV:
            strategy = Strategy.ONE_KV;
            break;
          case Strategy.CUSTOM:
            strategy = Strategy.CUSTOM;
            break;
          default:
            strategy = 9999;
        }
        apiNominate({
          params: apiParams.network,
          data: {
            stash: selectedAccount.address,
            validators: selectedValidators.map((v) => v.account),
            amount: Number(stakeAmount),
            strategy,
          },
        })
          .then((tag) => {
            apiNominated({
              params: apiParams.network,
              data: {
                tag,
                extrinsicHash: submittable.hash.toHex(),
              },
            }).catch((err) => {
              console.error(err);
            });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        const errString: string = err.toString();
        if (errString.indexOf('1010') !== -1) {
          toast.dismiss();
          notifyWarn('Inability to apy some fees. Account balance too low');
        } else if (errString.indexOf('Cancelled') !== -1) {
          toast.dismiss();
          notifyWarn('Transaction is cancelled');
        } else {
          // todo: collect error data
          toast.dismiss();
          notifyWarn('Something went wrong. Please try again.');
        }
        setNominating(false);
      });
  }, [
    accountChainInfo,
    polkadotApi,
    inputData.stakeAmount,
    inputData.rewardDestination,
    networkName,
    selectedAccount,
    finalFilteredTableData.tableData,
    notifyProcessing,
    txStatusCallback,
    notifyWarn,
    _formatBalance,
    setNominating,
    apiParams.network,
    inputData.strategy.value,
  ]);

  // while network status change, reset input stake amount
  useEffect(() => {
    if (networkStatus) {
      setInputData((prev) => ({ ...prev, stakeAmount: 0 }));
    }
  }, [networkStatus]);

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
          setApiLoading(true);
          let result: IValidator[];
          // retrive validators from in memory cache
          const isOneKv = apiParams.has_joined_1kv ? true : false;
          const now = Math.round(+new Date());
          if (
            isOneKv &&
            oneKValidatorCache.validators !== null &&
            oneKValidatorCache.expireTime !== null &&
            oneKValidatorCache.expireTime > now
          ) {
            result = oneKValidatorCache.validators;
          } else if (
            !isOneKv &&
            validatorCache.validators !== null &&
            validatorCache.expireTime !== null &&
            validatorCache.expireTime > now
          ) {
            result = validatorCache.validators;
          } else {
            // retrive validators from backend
            result = await apiGetAllValidator({
              params: apiParams.network,
              query: { ...apiParams },
              cancelToken: validatorAxiosSource.token,
            });
            // cache new validators
            cacheValidators(result, isOneKv);
          }
          setApiOriginTableData(formatToStakingInfo(result, networkName));
          setApiLoading(false);
        } catch (error) {}
      } else {
        setApiLoading(true);
      }
    })();
    return () => {
      if (networkStatus === ApiState.READY) {
        // console.log('========== API CANCEL ==========', tempId);
        validatorAxiosSource.cancel(`apiGetAllValidator req CANCEL ${tempId}`);
      }
    };
  }, [
    networkStatus,
    apiParams,
    networkName,
    validatorCache,
    cacheValidators,
    oneKValidatorCache.expireTime,
    oneKValidatorCache.validators,
  ]);

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
        accountChainInfo.validators,
        refStashId
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
    refStashId,
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
              <ContentBlockTitle color="white">{t('benchmark.staking.advancedSettings')}</ContentBlockTitle>
              <AdvancedSettingWrap>
                <TitleInput
                  disabled={apiLoading}
                  title={t('benchmark.staking.filters.minSelfStake')}
                  placeholder="input minimum amount"
                  inputLength={170}
                  value={advancedSetting.minSelfStake}
                  onChange={handleAdvancedFilter('minSelfStake')}
                />
                <TitleInput
                  disabled={apiLoading}
                  title={t('benchmark.staking.filters.maxUnclaimedEras')}
                  placeholder="input maximum amount"
                  inputLength={170}
                  value={advancedSetting.maxUnclaimedEras}
                  onChange={handleAdvancedFilter('maxUnclaimedEras')}
                />
                <TitleInput
                  disabled={apiLoading}
                  title={t('benchmark.staking.filters.apy')}
                  placeholder="0 - 100"
                  unit="%"
                  value={advancedSetting.historicalApy}
                  onChange={handleAdvancedFilter('historicalApy')}
                />
                <TitleInput
                  disabled={apiLoading}
                  title={t('benchmark.staking.filters.minEraInclusionRate')}
                  placeholder="0 - 100"
                  unit="%"
                  value={advancedSetting.minInclusion}
                  onChange={handleAdvancedFilter('minInclusion')}
                />
                <TitleSwitch
                  disabled={apiLoading}
                  title={t('benchmark.staking.filters.hasIdentity')}
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
                  title={t('benchmark.staking.filters.isSubIdent')}
                  checked={advancedSetting.isSubIdentity}
                  onChange={handleAdvancedFilter('isSubIdentity')}
                />
                <TitleSwitch
                  disabled={apiLoading}
                  title={t('benchmark.staking.filters.minApy')}
                  checked={advancedSetting.highApy}
                  onChange={handleAdvancedFilter('highApy')}
                />
                <TitleSwitch
                  disabled={apiLoading}
                  title={t('benchmark.staking.filters.decentralized')}
                  checked={advancedSetting.decentralized}
                  onChange={handleAdvancedFilter('decentralized')}
                />
                <TitleSwitch
                  disabled={apiLoading}
                  title={t('benchmark.staking.filters.onekv')}
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
    t,
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

  const refResultInfo = useMemo(() => {
    const display = finalFilteredTableData.tableData.find((data) => data.account === refStashId)?.display;
    const account = finalFilteredTableData.tableData.find((data) => data.account === refStashId)?.account;
    if (display) {
      return display;
    }
    if (account) {
      return shortenStashId(account);
    }
    return t('tools.valnom.refCode.refValidatorNone');
  }, [finalFilteredTableData.tableData, refStashId, t]);

  const filterResultInfo = useMemo(() => {
    let selectedValidatorsCount = finalFilteredTableData.tableData.filter(
      (data) => data.select === true
    ).length;
    let filterValidatorsCount = finalFilteredTableData.tableData.length;
    let totalValidatorsCount = apiOriginTableData.tableData.length;

    return (
      <div>
        <FilterInfo
          style={{
            color: '#20aca8',
            marginLeft: advancedOption.advanced ? 16 : 11,
          }}
        >
          {t('benchmark.staking.selected')}: {selectedValidatorsCount}
        </FilterInfo>
        <span>|</span>
        <FilterInfo>
          {t('benchmark.staking.filtered')}: {filterValidatorsCount}
        </FilterInfo>
        <span>|</span>
        <FilterInfo>
          {t('benchmark.staking.total')}: {totalValidatorsCount}
        </FilterInfo>
        <span>|</span>
        <FilterInfo style={{ color: '#20aca8' }}>
          {t('tools.valnom.refCode.refValidator')}: {refResultInfo}
        </FilterInfo>
      </div>
    );
  }, [
    advancedOption.advanced,
    apiOriginTableData.tableData.length,
    finalFilteredTableData.tableData,
    refResultInfo,
    t,
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
              <ContentBlockTitle color="white">
                {t('benchmark.staking.filterResult')}: {filterResultInfo}
              </ContentBlockTitle>
              {!apiLoading ? (
                <Table
                  type={tableType.stake}
                  columns={columns}
                  data={finalFilteredTableData.tableData}
                  pagination
                  customPageSize={customPageSize}
                />
              ) : (
                <ScaleLoader />
              )}
            </ContentColumnLayout>
          </AdvancedFilterBlock>
        </AdvancedBlockWrap>
      </>
    );
  }, [
    customPageSize,
    advancedOption.advanced,
    t,
    filterResultInfo,
    apiLoading,
    columns,
    finalFilteredTableData.tableData,
  ]);

  const accountInfo = useMemo(() => {
    if (isAccountInfoLoading) {
      return <ScaleLoader />;
    } else {
      return (
        <>
          <BalanceContextLeft>
            <BalanceContextRow>
              <div>
                <BalanceContextLabel>{t('benchmark.staking.role')}</BalanceContextLabel>
              </div>
              <div>
                <BalanceContextValue>{displayRole(accountChainInfo?.role)}</BalanceContextValue>
              </div>
            </BalanceContextRow>
            <BalanceContextRow>
              <div>
                <BalanceContextLabel>{t('benchmark.staking.nominees')}</BalanceContextLabel>
              </div>
              <div>
                <BalanceContextValue>{accountChainInfo?.validators?.length}</BalanceContextValue>
              </div>
            </BalanceContextRow>
            <BalanceContextRow>
              <div>
                <BalanceContextLabel>{t('benchmark.staking.bonded')}</BalanceContextLabel>
              </div>
              <div>
                <BalanceContextValue>{_formatBalance(accountChainInfo?.bonded)}</BalanceContextValue>
              </div>
            </BalanceContextRow>
          </BalanceContextLeft>
          <BalanceContextRight>
            <BalanceContextRow>
              <div>
                <BalanceContextLabel>{t('benchmark.staking.transferrable')}</BalanceContextLabel>
              </div>
              <div>
                <BalanceContextValue>
                  {_formatBalance(selectedAccount?.balances?.availableBalance)}
                </BalanceContextValue>
              </div>
            </BalanceContextRow>
            <BalanceContextRow>
              <div>
                <BalanceContextLabel>{t('benchmark.staking.reserved')}</BalanceContextLabel>
              </div>
              <div>
                <BalanceContextValue>
                  {_formatBalance(selectedAccount?.balances?.reservedBalance)}
                </BalanceContextValue>
              </div>
            </BalanceContextRow>
            <BalanceContextRow>
              <div>
                <BalanceContextLabel>{t('benchmark.staking.redeemable')}</BalanceContextLabel>
              </div>
              <div>
                <BalanceContextValue>{_formatBalance(accountChainInfo?.redeemable)}</BalanceContextValue>
              </div>
            </BalanceContextRow>
          </BalanceContextRight>
        </>
      );
    }
  }, [
    isAccountInfoLoading,
    accountChainInfo?.role,
    accountChainInfo?.validators?.length,
    accountChainInfo?.bonded,
    accountChainInfo?.redeemable,
    _formatBalance,
    selectedAccount?.balances?.availableBalance,
    selectedAccount?.balances?.reservedBalance,
    t,
    displayRole,
  ]);

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
          <ContentBlockBadgeBalance advanced={advancedOption.advanced}>
            <ContentBlockLeft>{networkDisplayDOM}</ContentBlockLeft>
            <ContentBlockRight>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                <Balance>
                  <div>{t('benchmark.staking.balance')}:</div>
                  <div>{walletBalance}</div>
                </Balance>

                {showBondedBtn && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 5,
                      minWidth: 32.19,
                    }}
                  >
                    <TinyButton
                      title={t('benchmark.staking.bonded')}
                      onClick={handleBondedClick}
                      primary={false}
                    />
                  </div>
                )}
                {showMaxBtn && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 5,
                      minWidth: 32.19,
                    }}
                  >
                    <TinyButton title={t('benchmark.staking.max')} onClick={handleMaxClick} primary={false} />
                  </div>
                )}
              </div>

              <Input
                style={{ width: '80%' }}
                onChange={handleInputChange('stakeAmount')}
                value={inputData.stakeAmount}
              />
            </ContentBlockRight>
          </ContentBlockBadgeBalance>
          {!isEmpty(selectedAccount) ? (
            <BalanceContextBlock advanced={advancedOption.advanced} show={true}>
              {accountInfo}
            </BalanceContextBlock>
          ) : (
            <></>
          )}
          <ArrowContainer advanced={advancedOption.advanced}>
            <GreenArrow />
          </ArrowContainer>
          <ContentBlock advanced={advancedOption.advanced}>
            <ContentBlockLeft>
              <ContentColumnLayout>
                <ContentBlockTitle>{t('benchmark.staking.strategyString')}</ContentBlockTitle>
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
              <Balance>{t('benchmark.staking.calculatedApy')}</Balance>
              {!apiLoading ? (
                <ValueStyle>{(finalFilteredTableData.calculatedApy * 100).toFixed(1)}%</ValueStyle>
              ) : (
                <ScaleLoader />
              )}
            </ContentBlockRight>
          </ContentBlock>
        </ContentBlockWrap>
        <div style={{ height: 17 }}></div>
        {!advancedOption.advanced ? (
          <>
            <RefValidatorName>
              <div style={{ marginLeft: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  {t('benchmark.staking.filterResult')}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 12 }}>
                  {filterResultInfo}
                </div>
              </div>
            </RefValidatorName>
            <div style={{ height: 17 }}></div>
          </>
        ) : null}
        <RewardBlockWrap advanced={advancedOption.advanced}>
          <RewardBlock
            advanced={advancedOption.advanced}
            style={{ backgroundColor: '#2E3843', height: 'auto' }}
          >
            <ContentColumnLayout width="100%" justifyContent="flex-start">
              <ContentBlockTitle color="white">{t('benchmark.staking.rewardDest')}</ContentBlockTitle>
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
              title={t('benchmark.staking.nominate')}
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

interface IContentBlock {
  advanced: Boolean;
}
const ContentBlock = styled.div<IContentBlock>`
  background-color: white;
  border-radius: 6px 6px 6px 6px;
  padding: 14px 25px 14px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  width: ${(props) => (props.advanced ? '400px' : '570px')};
  @media (max-width: 1395px) {
    width: 570px;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

interface IContentBlockBadgeBalance {
  advanced: Boolean;
}
const ContentBlockBadgeBalance = styled.div<IContentBlockBadgeBalance>`
  background-color: white;
  border-radius: ${(props) => (props.advanced ? '6px 0px 0px 6px' : '6px 6px 0px 0px')};
  padding: 14px 25px 14px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  width: ${(props) => (props.advanced ? '500px' : '570px')};
  @media (max-width: 1395px) {
    border-radius: 6px 6px 0px 0px;
    width: 570px;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
    border-radius: 6px 6px 0px 0px;
  }
`;

interface IBalanceContextBlock {
  advanced: boolean;
  show: boolean;
}
const BalanceContextBlock = styled.div<IBalanceContextBlock>`
  background-color: #0b0d13;
  border-radius: ${(props) => (props.advanced ? '0px 6px 6px 0px' : '0px 0px 6px 6px')};
  display: ${(props) => (props.show ? 'flex' : 'none')};
  justify-content: space-around;
  align-items: center;
  padding: 14px 25px 14px 25px;
  height: 62px;
  width: ${(props) => (props.advanced ? '640px' : '570px')};
  @media (max-width: 1395px) {
    border-radius: 0px 0px 6px 6px;
    width: 570px;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
    border-radius: 0px 0px 6px 6px;
  }
`;

const BalanceContextLeft = styled.div`
  flex: 1;
  width: 100%;
`;

const BalanceContextRight = styled.div`
  flex: 1;
  width: 100%;
`;

const BalanceContextRow = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 0px 10px 0px 16px;
  justify-content: space-between;
`;

const BalanceContextLabel = styled.div`
  font-family: Montserrat;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  color: white;
`;

const BalanceContextValue = styled.div`
  font-family: Montserrat;
  font-size: 15px;
  font-weight: 500;
  text-align: right;
  color: #23beb9;
`;

type BalanceProps = {
  color?: string;
};

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

const RefValidatorName = styled.div`
  border-radius: 6px;
  padding: 14px 0px 14px 0px;
  background-color: #2e3843;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  color: white;
  width: 620px;
  @media (max-width: 1395px) {
    width: 620px;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 110px);
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
  justify-content: space-between;
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
  flex: 1.3;
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
