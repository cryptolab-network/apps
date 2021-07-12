import { configureStore } from '@reduxjs/toolkit';
import { networkSlice, walletSlice } from '../redux';

const store = configureStore({
  reducer: {
    network: networkSlice.reducer,
    wallet: walletSlice.reducer,
    // apiHandler: apiHandlerSlice.reducer,
  }
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

