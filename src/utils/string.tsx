const { decodeAddress, encodeAddress } = require('@polkadot/keyring');
const { hexToU8a, isHex } = require('@polkadot/util');

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
