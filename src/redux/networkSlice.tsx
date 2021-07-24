import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkStatus } from '../utils/status/Network';

interface networkState {
  name: string;
  status: NetworkStatus;
}

const initialState: networkState = {
  name: 'Kusama',
  status: NetworkStatus.DISCONNECTED,
};

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    networkChanged: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        name: action.payload,
        status: NetworkStatus.DISCONNECTED,
      };
    },
    networkStatusChanged: (state, action: PayloadAction<NetworkStatus>) => {
      return {
        ...state,
        status: action.payload,
      };
    },
  },
});

export const { networkChanged, networkStatusChanged } = networkSlice.actions;
