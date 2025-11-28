import { combineReducers, configureStore, Reducer, Action } from '@reduxjs/toolkit';
import commonReducer from '@hubgroup-share-system-fe/react/providers/context/common.reducer';
import { createReducerManager, ReducerManager } from './reducerManager';

/**
 * Initial reducers (available from start)
 */
const initialReducers = {
    common: commonReducer,
};

/**
 * Create reducer manager for dynamic injection
 */
const reducerManager: ReducerManager = createReducerManager(initialReducers);

/**
 * Configure Redux store with dynamic reducer support
 */
const store = configureStore({
    reducer: reducerManager.reduce,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true,
            serializableCheck: false,
        }),
});

// Type exports for use throughout app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Inject a new reducer at runtime (for remote modules)
 * @param key - Unique key for the reducer
 * @param reducer - Reducer function
 *
 * @example
 * ```tsx
 * import { injectReducer } from 'src/app/shareds/providers/redux/store';
 * import userReducer from './slices/userSlice';
 *
 * injectReducer('user', userReducer);
 * store.replaceReducer(reducerManager.reduce);
 * ```
 */
export function injectReducer<S = any, A extends Action = Action>(key: string, reducer: Reducer<S, A>): boolean {
    const added = reducerManager.add(key, reducer);
    if (added) {
        store.replaceReducer(reducerManager.reduce);
    }
    return added;
}

/**
 * Eject a reducer at runtime (cleanup)
 * @param key - Reducer key to remove
 *
 * @example
 * ```tsx
 * ejectReducer('user');
 * store.replaceReducer(reducerManager.reduce);
 * ```
 */
export function ejectReducer(key: string): boolean {
    const removed = reducerManager.remove(key);
    if (removed) {
        store.replaceReducer(reducerManager.reduce);
    }
    return removed;
}

/**
 * Check if a reducer is registered
 */
export function hasReducer(key: string): boolean {
    return reducerManager.has(key);
}

/**
 * Get all current reducers
 */
export function getReducers() {
    return reducerManager.getReducers();
}

export { store, reducerManager };
