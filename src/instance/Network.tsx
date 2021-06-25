import keys from '../config/keys';
import { ApiPromise, WsProvider } from '@polkadot/api';

class Network {
  currentNetwork: string;
  api: ApiPromise;
  constructor() {
    this.currentNetwork = keys.kusamaNetwork!;
    this.api = new ApiPromise();
  }
  async setNetwork(networkName = 'KSM') {
    console.log('will change to network :', networkName);
    switch (networkName) {
      case 'KSM':
        this.currentNetwork = keys.kusamaNetwork!;
        break;
      case 'DOT':
        this.currentNetwork = keys.polkadotNetwork!;
        break;
      default:
        console.log('WHY IN THIS');
        break;
    }
    const wsProvider = new WsProvider(this.currentNetwork);
    this.api = await ApiPromise.create({ provider: wsProvider });

    // testing code...
    // console.log('current network: ', networkName);
    // console.log('current network config: ', this.currentNetwork);
    // let { nonce, data: balance } = await this.api.query.system.account(
    //   '5CCbH1g9YBqYwTV8g4AK1mrYouQXwJn6ghsgcsg1UKU4fVdo'
    // );
    // console.log('inside root balance: ', balance.free);
  }

  async getBalance(walletAddress = '') {
    // TODO: check wallet address is valid or not
    if (walletAddress) {
      const balance = await this.api.query.system.account(walletAddress);
      return balance.data.free;
    }
    throw new Error('you must input a wallet address');
  }
}

const polkadotChain = new Network();

export { polkadotChain };
