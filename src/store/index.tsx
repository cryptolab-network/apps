import { configureStore } from '@reduxjs/toolkit';
import { walletSlice, nominatorsSlice } from '../redux';

const store = configureStore({
  reducer: {
    // network: networkSlice.reducer,
    wallet: walletSlice.reducer,
    nominators: nominatorsSlice.reducer,
  }
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

