import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex, formatBalance } from '@polkadot/util';

export function shortenStashId(address): string {
  let shortenAddress = address;
  if (shortenAddress.length > 35) {
    shortenAddress =
      shortenAddress.substring(0, 5) + '...' + shortenAddress.substring(shortenAddress.length - 5);
  }
  return shortenAddress;
}

export function validateAddress(address: string): boolean {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
    return true;
  } catch (error) {
    return false;
  }
}

export function makeMonth(month: number): string {
  if (month >= 0 && month <= 8) {
    return '0' + (month + 1);
  } else if (month > 8 && month <= 11) {
    return (month + 1).toString();
  } else {
    return '';
  }
}

const _toFixedString = (value: string): string => {
  const substring = value.split(' ');
  const temp = substring[0].slice(0, -2);
  return temp + ' ' + substring[1];
}

export const balanceUnit = (
  network: string,
  value: string | number | undefined = 0,
  isForceUnit: boolean = false,
  toFixed: boolean
): string => {
  let result;
  switch (network) {
    case 'Kusama':
    case 'KSM':
      if (BigInt(value) === BigInt(0)) return '0 KSM';
      result = formatBalance(BigInt(value), {
        decimals: 12,
        forceUnit: isForceUnit ? 'KSM' : undefined,
        withUnit: 'KSM',
      });
      break;
    case 'Polkadot':
    case 'DOT':
      if (BigInt(value) === BigInt(0)) return '0 DOT';
      result = formatBalance(BigInt(value), {
        decimals: 10,
        forceUnit: isForceUnit ? 'DOT' : undefined,
        withUnit: 'DOT',
      });
      break;
    case 'Westend':
    case 'WND':
      if (BigInt(value) === BigInt(0)) return '0 WND';
      result = formatBalance(value, {
        decimals: 12,
        forceUnit: isForceUnit ? 'WND' : undefined,
        withUnit: 'WND',
      });
      break;
    default:
      if (value === 0 || value === 0) return '0 UNIT';
      result = formatBalance(BigInt(value), {
        decimals: 12,
        forceUnit: isForceUnit ? 'UNIT' : undefined,
        withUnit: 'UNIT',
      });
  }
  if (toFixed) {
    return _toFixedString(result);
  }
  return result;
};
