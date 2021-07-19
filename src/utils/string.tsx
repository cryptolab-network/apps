
export function shortenStashId(address): string {
  let shortenAddress = address;
  if (shortenAddress.length > 35) {
    shortenAddress = shortenAddress.substring(0, 5) + '...' + shortenAddress.substring(shortenAddress.length - 5);
  }
  return shortenAddress;
};