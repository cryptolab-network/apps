import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiHandler, NetworkName } from '../instance/ApiHandler';
import { ApiPromise } from '@polkadot/api';

interface IApiState {
  handler: ApiHandler | null;
  api: ApiPromise | null;
}

const initialState: IApiState = {
  handler: null,
  api: null,
}

export const createApi = createAsyncThunk('apiHandler/createApi', async (network: string) => {
  const apiHandler = await ApiHandler.create(network);
  return {
    handler: apiHandler
  }
});

export const apiHandlerSlice = createSlice({
  name: 'apiHandler',
  initialState,
  reducers: {
    getApi: (state, action: PayloadAction<void>) => {
      return {
        ...state,
        api: (!!state.handler) ? state.handler.getApi() : null
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createApi.pending, (state, action) => {
        state.handler = null;
      })
      .addCase(createApi.fulfilled, (state, action) => {
        state.handler = action.payload.handler;
      })
  }
});

export const { getApi } = apiHandlerSlice.actions;
