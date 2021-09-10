import { ApiPromise } from "@polkadot/api";
import BN from "bn.js";

const POLKADOT_PARAMS = {
  auctionAdjust: 0,
  auctionMax: 0,
  falloff: 0.05,
  maxInflation: 0.1,
  minInflation: 0.025,
  stakeTarget: 0.75
}

const KUSAMA_PARAMS = {
  auctionAdjust: (0.3 / 60),
  auctionMax: 60,
  falloff: 0.05,
  maxInflation: 0.1,
  minInflation: 0.025,
  stakeTarget: 0.75
}

const WESTEND_PARAMS = {
  auctionAdjust: 0,
  auctionMax: 0,
  falloff: 0.05,
  maxInflation: 0.1,
  minInflation: 0.025,
  stakeTarget: 0.5
}

const CHAIN_PARAMS = {
  Kusama: KUSAMA_PARAMS,
  Polkadot: POLKADOT_PARAMS,
  Westend: WESTEND_PARAMS,
}

export const chainGetValidatorCounts = async (chain: string, api: ApiPromise): Promise<number> => {
  const validatorCount = await api.query.staking.validatorCount();
  return validatorCount.toNumber();
};

export const chainGetNominatorCounts = async (chain: string, api: ApiPromise): Promise<number> => {
  const nominators = await api.query.staking.nominators.entries();
  return nominators.length;
};

export const chainGetWaitingCount = async (chain: string, api: ApiPromise): Promise<number> => {
  const waiting = await api.derive.staking.waitingInfo();
  return waiting.info.length;
};

const queryActiveEra = async (api: ApiPromise) => {
  // console.time('chain :: queryActiveEra');
  try {
    const [activeEra] = await Promise.all([
      api.query.staking.activeEra(),
    ]);
    // console.timeEnd('chain :: queryActiveEra')
    
    return activeEra.unwrap().index.toNumber();
  } catch (err) {
    // console.log(err);
    return 0;
  }
}

const queryErasTotalStake = async (api: ApiPromise, activeEra: number) => {
  // console.time('chain :: queryErasTotalStake');
  try {
    const [erasTotalStake] = await Promise.all([
      api.query.staking.erasTotalStake(activeEra),
    ]);
    // console.timeEnd('chain :: queryErasTotalStake');
    return erasTotalStake;
  } catch (err) {
    // console.log(err);
    return null;
  }
}

const queryTotalIssuance = async (api: ApiPromise) => {
  // console.time('chain :: queryTotalIssuance');
  try {
    const [totalIssuance] = await Promise.all([
      api.query.balances.totalIssuance(),
    ]);
    // console.timeEnd('chain :: queryTotalIssuance')
    return totalIssuance;
  } catch (err) {
    // console.log(err);
    return null;
  }
}

export const calcInflation = async (chain: string, api: ApiPromise) => {
  const activeEra = await queryActiveEra(api);
  const totalStake = await queryErasTotalStake(api, activeEra);
  if (totalStake === null) {
    throw new Error('failed to get totalStake');
  }
  const totalIssuance = await queryTotalIssuance(api);
  if (totalIssuance === null) {
    throw new Error('failed to get total issurance');
  }
  const BN_MILLION = new BN('1000000', 10);
  const numAuctions = (chain === 'Kusama') ? 5 : 0;
  const { auctionAdjust, auctionMax, falloff, maxInflation, minInflation, stakeTarget } = CHAIN_PARAMS[chain];
  const stakedFraction = totalStake.isZero() || totalIssuance.isZero() ? 0 : totalStake.mul(BN_MILLION).div(totalIssuance).toNumber() / BN_MILLION.toNumber();
  const idealStake = stakeTarget - (Math.min(auctionMax, numAuctions)) * auctionAdjust;
  const idealInterest = maxInflation / idealStake;
  const inflation = 100 * (minInflation + (stakedFraction <= idealStake ? (stakedFraction * (idealInterest - (minInflation / idealStake))) : (((idealInterest * idealStake) - minInflation) * Math.pow(2, (idealStake - stakedFraction) / falloff))));
  const stakedReturned = stakedFraction ? (inflation / stakedFraction) : 0;
  return {
    inflation,
    stakedReturned
  };
}
