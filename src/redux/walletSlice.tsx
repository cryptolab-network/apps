import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { web3Accounts, web3Enable, isWeb3Injected } from '@polkadot/extension-dapp';
import { InjectedExtension, InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

const networkInfo = [
  {
    name: 'Polkadot',
    prefix: 1,
    genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3'
  },
  {
    name: 'Kusama',
    prefix: 2,
    genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe'
  },
]

export enum WalletStatus {
  IDLE,
  LOADING,
  CONNECTED,
  DENIED,
  NO_EXTENSION
}

export interface IInject {
  name: string,
  version: string
}

export interface IAccount {
  address: string,
  name?: string,
  source: string,
  genesisHash?: string | null
}

export interface IWallet {
  status: WalletStatus;
  allInjected: IInject[];
  allAccounts: IAccount[];
  filteredAccounts: IAccount[]; // Account is filtered by network
  selectedAccount: IAccount | null;
}

const initialState: IWallet = {
  status: WalletStatus.IDLE,
  allInjected: [],
  allAccounts: [],
  filteredAccounts: [],
  selectedAccount: null
}

export const connectWallet = createAsyncThunk('wallet/connectWallet', async (network: string): Promise<any> => {
  try {
    const injected: InjectedExtension[] = await web3Enable('CryptoLab');
    const allInjected = injected.map(inject => {
      return {
        name: inject.name,
        version: inject.version
      }
    });

    if (!isWeb3Injected) {
      console.log(`no extension`);
      return {
        allInjected: [],
        allAccounts: [],
        filteredAccounts: [],
        selectedAccount: null,
        status: WalletStatus.NO_EXTENSION
      }
    }

    if (allInjected.length === 0) {
      console.log(`denied`);
      return {
        allInjected: [],
        allAccounts: [],
        filteredAccounts: [],
        selectedAccount: null,
        status: WalletStatus.DENIED
      }
    }

    const accounts: InjectedAccountWithMeta[] = await web3Accounts();
    const allAccounts = accounts.map((account: InjectedAccountWithMeta) => {
      return {
        address: account.address,
        name: account.meta.name,
        source: account.meta.source,
        genesisHash: account.meta.genesisHash
      }
    });

    const filteredAccounts = accountTransform(allAccounts, network);
    const selectedAccount = (filteredAccounts.length > 1) ? filteredAccounts[0] : null
    return {
      allInjected,
      allAccounts,
      status: WalletStatus.CONNECTED,
      filteredAccounts,
      selectedAccount,
    }

  } catch (err) {
    console.log(err);
    throw Error('connectWallet');
  }
})

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    selectAccount: (state, action: PayloadAction<IAccount>) => {
      state.selectedAccount = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(connectWallet.pending, (state, action) => {
        state.status = WalletStatus.LOADING
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.allInjected = action.payload.allInjected;
        state.allAccounts = action.payload.allAccounts;
        state.filteredAccounts = action.payload.filteredAccounts;
        state.selectedAccount = action.payload.selectedAccount;
        state.status = action.payload.status;
      })
  }
});

export const accountTransform = (accounts: IAccount[], network: string): IAccount[] => {
  const info = networkInfo.find(info => info.name === network);
  const filtered = accounts.filter((account) => {
    return (account.genesisHash === null || account.genesisHash === info?.genesisHash)
  });
  return filtered.map(account => {
    const address = encodeAddress(isHex(account.address) ? hexToU8a(account.address) : decodeAddress(account.address), info?.prefix);
    return {
      address,
      name: account.name,
      source: account.source,
      genesisHash: account.genesisHash
    }
  });
}

export const { selectAccount } = walletSlice.actions;

