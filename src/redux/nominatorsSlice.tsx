import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetAllNominators } from '../apis/Nominator';

enum NominatorsStatus {
  IDLE,
  LOADING,
  FULFILLED,
}

interface IBalance {
  freeBalance: number;
  lockedBalance: number;
}

interface INominator {
  address: string;
  balance: IBalance;
}

const initialState = {
  status: NominatorsStatus.IDLE,
  elements: null,
}

export const getNominators = createAsyncThunk('nominators/getNominators', async (network: string): Promise<any> => {
  try {
    const result = await apiGetAllNominators({
      params: {
        chain: (network === 'Kusama') ? 'KSM' : 'DOT'
      }
    });
    return {
      status: NominatorsStatus.FULFILLED,
      elements: result
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
