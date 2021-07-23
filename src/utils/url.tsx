export const getUrls = (location: Location, subdomain: string): [string, string] => {
  let domain = '';
  const { protocol, port } = location;
  const urlParts = location.hostname.split('.');
  if (location.hostname.indexOf('localhost') !== -1) {
    domain = (urlParts.length === 1) ? urlParts[0] : urlParts[1];
  } else {
    domain = urlParts.slice(0).slice(-(urlParts.length === 4 ? 3 : 2)).join('.');
  }

  const staking_url = `${protocol}//${domain}${(port !== '') ? ':' + port : port}`
  const tools_url = `${protocol}//${subdomain}.${domain}${(port !== '') ? ':' + port : port}`;
  return [staking_url, tools_url];
}