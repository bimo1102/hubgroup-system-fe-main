declare module 'GeneralApplication/store' {
    import { Store, Reducer, AnyAction } from '@reduxjs/toolkit';

    export const store: Store<any>;
    export const storeReady: Promise<any>;
    export type RootState = ReturnType<typeof store.getState>;
    export type Dispatch = typeof store.dispatch;

    export function injectReducer(key: string, reducer: Reducer<any, AnyAction>): boolean;
    export function ejectReducer(key: string): boolean;
    export function hasReducer(key: string): boolean;
    export function getReducers(): Record<string, Reducer>;
}

declare module 'GeneralReactModule/*' {
    import { ComponentType } from 'react';
    const Component: ComponentType<any>;
    export default Component;
}
