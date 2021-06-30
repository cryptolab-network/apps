import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface networkState {
  name: string;
}

const initialState: networkState = {
  name: 'Kusama'
}

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    networkChanged: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        name: action.payload
      }
    },
  }
});

export const { networkChanged } = networkSlice.actions;
