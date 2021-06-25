# CryptoLab Web

## Environment

npm v6.14.7^

## Run

### Development environment

1. Prepare your `./config/dev.js`

1. Install dependency
   `$ npm install`

1. Start the web
   `$ npm run start`

### Production environment

1. Use production environment variable

```
export NODE_ENV=production
export POLKADOT_NETWORK=<YOUR_POLKADOT_WSS_NETWORK>
export KUSAMA_NETWORK=<YOUR_KUSAMA_WSS_NETWORK>
```

1. Install dependency
   `$ npm install`

1. Start the web
   `$ npm run start`

## Notes

- /redux
- /store
- hooks.tsx

are experiment/template code, should be remove before production
