import { configureStore } from '@reduxjs/toolkit';
import { counterSlice, networkSlice } from '../redux';

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    network: networkSlice.reducer
  }
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

