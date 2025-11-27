import { combineReducers, configureStore } from '@reduxjs/toolkit';
import commonReducer from '@hubgroup-share-system-fe/react/providers/context/common.reducer';
import testReducer from './reducers/test.reducer';
const rootReducer = combineReducers({
    common: commonReducer,
    test: testReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true,
            serializableCheck: false,
            // actionCreatorCheck: true,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
