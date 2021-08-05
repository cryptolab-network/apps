import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex, formatBalance } from '@polkadot/util';

export function shortenStashId(address): string {
  let shortenAddress = address;
  if (shortenAddress.length > 35) {
    shortenAddress = shortenAddress.substring(0, 5) + '...' + shortenAddress.substring(shortenAddress.length - 5);
  }
  return shortenAddress;
};

export function validateAddress(address): boolean {
  try {
    encodeAddress(
      isHex(address)
        ? hexToU8a(address)
        : decodeAddress(address)
    );
    return true;
  } catch (error) {
    return false;
  }
}

export const balanceUnit = (network: string, value: string | number | undefined = 0, isForceUnit: boolean = false): string => {
  switch (network) {
    case 'Kusama':
      if (BigInt(value) === BigInt(0)) return '0 KSM';
      return (
        formatBalance(BigInt(value), {
          decimals: 12,
          forceUnit: (isForceUnit) ? 'KSM' : undefined,
          withUnit: 'KSM'
        })
      )
    case 'KSM':
      if (BigInt(value) === BigInt(0)) return '0 KSM';
      return (
        formatBalance(BigInt(value), {
          decimals: 12,
          forceUnit: (isForceUnit) ? 'KSM' : undefined,
          withUnit: 'KSM'
        })
      )
    case 'Polkadot':
      if (BigInt(value) === BigInt(0)) return '0 DOT';
      return (
        formatBalance(value, {
          decimals: 10,
          forceUnit: (isForceUnit) ? 'DOT' : undefined,
          withUnit: 'DOT'
        })
      )
    case 'DOT':
      if (BigInt(value) === BigInt(0)) return '0 DOT';
      return (
        formatBalance(BigInt(value), {
          decimals: 10,
          forceUnit: (isForceUnit) ? 'DOT' : undefined,
          withUnit: 'DOT'
        })
      )
    case 'Westend':
      if (BigInt(value) === BigInt(0)) return '0 WND';
      return (
        formatBalance(BigInt(value), {
          decimals: 12,
          forceUnit: (isForceUnit) ? 'WND' : undefined,
          withUnit: 'WND'
        })
      )
    case 'WND':
      if (BigInt(value) === BigInt(0)) return '0 WND';
      return (
        formatBalance(value, {
          decimals: 12,
          forceUnit: (isForceUnit) ? 'WND' : undefined,
          withUnit: 'WND'
        })
      )
    default:
      if (value === 0 || value === 0) return '0 UNIT';
      return (
        formatBalance(BigInt(value), {
          decimals: 12,
          forceUnit: (isForceUnit) ? 'UNIT' : undefined,
          withUnit: 'UNIT'
        })
      )
  }
}
