module.exports = {
  defaultNetwork: process.env.REACT_APP_DEFAULT_NETWORK || 'Kusama',
  toolDomain: process.env.REACT_APP_TOOL_DOMAIN || 'tools',
  proxyTarget: process.env.REACT_APP_PROXY_TARGET,
  gaTrackingId: process.env.REACT_APP_GA_TRACKING_ID || '',
  apiVersion: process.env.REACT_APP_API_VERSION,
  tgBotUrl: process.env.REACT_APP_TG_BOT_URL || 'https://t.me/cryptolab_nominator_bot',
};
