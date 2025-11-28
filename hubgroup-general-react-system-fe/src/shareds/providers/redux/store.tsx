import { combineReducers, configureStore } from '@reduxjs/toolkit';
import commonReducer from '@hubgroup-share-system-fe/react/providers/context/common.reducer';
import myRemoteReducer from './reducers/test.reducer';
const rootReducer = combineReducers({
    common: commonReducer,
    myRemote: myRemoteReducer,
});

export const remoteStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true,
            serializableCheck: false,
            // actionCreatorCheck: true,
        }),
});

export type RootState = ReturnType<typeof remoteStore.getState>;
export type Dispatch = typeof remoteStore.dispatch;
