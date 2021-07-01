import { configureStore } from '@reduxjs/toolkit';
import { counterSlice, networkSlice, walletSlice } from '../redux';

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    network: networkSlice.reducer,
    wallet: walletSlice.reducer
  }
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

