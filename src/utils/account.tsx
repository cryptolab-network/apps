import { ApiPromise } from '@polkadot/api';
import { Option } from '@polkadot/types';
import { StakingLedger } from '@polkadot/types/interfaces/staking';
import { IAccount } from '../components/Api';

export enum AccountRole {
  VALIDATOR,
  CONTROLLER_OF_VALIDATOR,
  CONTROLLER_OF_NOMINATOR,
  NOMINATOR,
  NOMINATOR_AND_CONTROLLER,
  NONE,
}

export interface IAccountChainInfo {
  role: AccountRole;
  controller: string | undefined;
  validators: string[];
  rewardDestination: RewardDestinationType;
  rewardDestinationAddress: string | null;
  bonded: string;
  redeemable: string;
  isNominatable: boolean;
  isReady: boolean;
  address: string;
}

export enum RewardDestinationType {
  NULL,
  STAKED,
  STASH,
  CONTROLLER,
  ACCOUNT,
}

export const queryStakingInfo = async (address, api: ApiPromise) => {
  const [info, ledger] = await Promise.all([
    api.derive.staking.account(address),
    api.query.staking.ledger<Option<StakingLedger>>(address),
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
    // console.log(`role = VALIDATOR`);
  } else if (!info.stakingLedger.total.unwrap().isZero()) {
    if (info.controllerId?.toHuman() === address) {
      role = AccountRole.NOMINATOR_AND_CONTROLLER;
      bonded = info.stakingLedger.total.unwrap().toHex();
      validators = info.nominators.map((n) => n.toHuman());
      // console.log(`role = NOMINATOR_AND_CONTROLLER`);
      isNominatable = true;
    } else {
      role = AccountRole.NOMINATOR;
      bonded = info.stakingLedger.total.unwrap().toHex();
      validators = info.nominators.map((n) => n.toHuman());
      // console.log(`role = NOMINATOR`);
    }
  } else if (!ledger.isNone) {
    const stash = ledger.unwrap().stash.toHuman();
    const staking = await api.derive.staking.account(stash);
    if (staking.nextSessionIds.length !== 0) {
      role = AccountRole.CONTROLLER_OF_VALIDATOR;
      bonded = staking.stakingLedger.total.unwrap().toHex();
      validators = staking.nominators.map((n) => n.toHuman());
      // console.log(`role = CONTROLLER_OF_VALIDATOR`);
    } else {
      role = AccountRole.CONTROLLER_OF_NOMINATOR;
      bonded = staking.stakingLedger.total.unwrap().toHex();
      validators = staking.nominators.map((n) => n.toHuman());
      // console.log(`role = CONTROLLER_OF_NOMINATOR`);
      isNominatable = true;
    }
  } else {
    role = AccountRole.NONE;
    bonded = info.stakingLedger.total.unwrap().toHex();
    validators = info.nominators.map((n) => n.toHuman());
    // console.log(`role = NONE`);
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
    address: address,
  };
};

export const getAccountName = (address: string = '', accounts: IAccount[]): string => {
  let nameMap = accounts.filter((account) => account.address === address);

  if (nameMap && nameMap.length > 0) {
    return nameMap[0].name || '';
  }

  return address;
};
