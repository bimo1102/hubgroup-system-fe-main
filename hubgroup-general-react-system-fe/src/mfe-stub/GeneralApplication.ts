import type { Reducer, AnyAction } from '@reduxjs/toolkit';

export const store: any = null;
export function injectReducer(key: string, reducer: Reducer<any, AnyAction>): boolean {
    return false;
}
