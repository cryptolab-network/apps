module.exports = {
  polkadotWSS: process.env.REACT_APP_POLKADOT_WSS,
  kusamaWSS: process.env.REACT_APP_KUSAMA_WSS,
  toolDomain: process.env.REACT_APP_TOOL_DOMAIN || 'tools',
  proxyTarget: process.env.REACT_APP_PROXY_TARGET,
  gaTrackingId: process.env.REACT_APP_GA_TRACKING_ID,
  apiVersion: process.env.REACT_APP_API_VERSION,
};
