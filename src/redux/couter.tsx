import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
// Define a type for the slice state
interface CounterState {
  value: number;
}
// Define the initial state using that type
const initialState = { value: 100 } as CounterState;

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      console.log('state: ', state);
      console.log('number: ', action.payload);
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
