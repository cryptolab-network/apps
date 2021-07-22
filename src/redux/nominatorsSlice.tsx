import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetAllNominators, INominatorInfo } from '../apis/Nominator';
import { accountTransform } from './walletSlice';

export enum NominatorsStatus {
  IDLE,
  LOADING,
  FULFILLED,
}

const initialState = {
  status: NominatorsStatus.IDLE,
  elements: {},
}

export const getNominators = createAsyncThunk('nominators/getNominators', async (network: string): Promise<any> => {
  try {
    const result = await apiGetAllNominators({
      params: {
        chain: (network === 'Kusama') ? 'KSM' : 'DOT'
      }
    });
    const m = result.reduce((acc, n) => {
      acc[n.accountId] = n;
      return acc;
    }, {});
    return {
      status: NominatorsStatus.FULFILLED,
      elements: m
    }
  } catch (err) {
    console.log(err);
    throw Error('getNominators');
  }
})

export const nominatorsSlice = createSlice({
  name: 'nominators',
  initialState,
  reducers: {

  },
  extraReducers: builder => {
    builder
      .addCase(getNominators.pending, (state, action) => {
        state.status = NominatorsStatus.LOADING
      })
      .addCase(getNominators.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.elements = action.payload.elements;
      })
  }
});
