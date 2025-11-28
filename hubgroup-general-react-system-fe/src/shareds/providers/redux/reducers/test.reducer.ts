// remote/src/redux/myReducer.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: 0 };

const myRemoteReducer = createSlice({
    name: 'myRemoteReducer',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
    },
});

export const { increment, decrement } = myRemoteReducer.actions;
export default myRemoteReducer.reducer;
