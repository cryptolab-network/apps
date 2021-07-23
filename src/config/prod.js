module.exports = {
  polkadotWSS: process.env.POLKADOT_WSS,
  kusamaWSS: process.env.KUSAMA_WSS,
  cryptoLabBackendUrl: 'http://127.0.0.1:3030',
  toolDomain: process.env.TOOL_DOMAIN || 'tools',
  proxyTarget: process.env.REACT_APP_PROXY_TARGET,
  gaTrackingId: process.env.REACT_APP_GA_TRACKING_ID,
  apiVersion: process.env.API_VERSION,
};
