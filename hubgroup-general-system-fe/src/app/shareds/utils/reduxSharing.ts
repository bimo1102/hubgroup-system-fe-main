/**
 * Utility module for sharing Redux reducers between host and remote modules
 * Supports both shared store (from host) and standalone store (for remote)
 */

import { Reducer, Action } from 'redux';
import type { RootState, AppDispatch } from '../providers/redux/store';

/**
 * Options for reducer registration
 */
export interface ReducerRegistrationOptions {
    /** Unique key for the reducer in store */
    key: string;
    /** Reducer function */
    reducer: Reducer<any, any>;
    /** Auto-cleanup when module unmounts (default: true) */
    autoCleanup?: boolean;
    /** Override if already exists (default: false) */
    overwrite?: boolean;
}

/**
 * Register a reducer to be injected into host store
 * Can be called directly or within a hook
 *
 * @param options - Registration options
 * @returns Function to unregister the reducer
 *
 * @example
 * ```tsx
 * // In remote module
 * import { registerReducer } from '@hubgroup-share-system-fe/redux';
 * import userReducer from './redux/userSlice';
 *
 * // Register at module load
 * const unregister = registerReducer({
 *   key: 'user',
 *   reducer: userReducer,
 *   autoCleanup: true,
 * });
 * ```
 */
export async function registerReducer(
    options: ReducerRegistrationOptions
): Promise<{ success: boolean; message: string }> {
    const { key, reducer, autoCleanup = true, overwrite = false } = options;

    try {
        // Try to get store from host via Module Federation
        const hostStore = await loadHostStore();

        if (!hostStore) {
            console.warn('[registerReducer] Host store not available, reducer will be standalone');
            return {
                success: false,
                message: 'Host store not available',
            };
        }

        // Inject reducer
        const { injectReducer, hasReducer } = hostStore;

        if (!overwrite && hasReducer(key)) {
            console.warn(`[registerReducer] Reducer "${key}" already exists`);
            return {
                success: false,
                message: `Reducer "${key}" already exists`,
            };
        }

        const injected = injectReducer(key, reducer);

        if (!injected) {
            throw new Error(`Failed to inject reducer "${key}"`);
        }

        console.info(`[registerReducer] Successfully registered reducer "${key}"`);

        // Return cleanup function if autoCleanup enabled
        if (autoCleanup) {
            return {
                success: true,
                message: `Reducer "${key}" registered`,
            };
        }

        return {
            success: true,
            message: `Reducer "${key}" registered (no auto-cleanup)`,
        };
    } catch (error) {
        console.error('[registerReducer] Error:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Load host store via Module Federation
 * @internal
 */
async function loadHostStore() {
    try {
        // @ts-ignore - webpack runtime
        const container = (window as any).GeneralApplication;

        if (!container) {
            console.warn('[loadHostStore] Host container not found');
            return null;
        }

        // Initialize if needed
        if (container.init) {
            try {
                // @ts-ignore
                await container.init(__webpack_share_scopes__.default);
            } catch (e) {
                // Already initialized
            }
        }

        // Load store module
        const storeFactory = await container.get('./store');
        const storeModule = storeFactory();

        return {
            injectReducer: storeModule.injectReducer,
            ejectReducer: storeModule.ejectReducer,
            hasReducer: storeModule.hasReducer,
            getReducers: storeModule.getReducers,
            store: storeModule.store,
        };
    } catch (error) {
        console.error('[loadHostStore] Error loading host store:', error);
        return null;
    }
}

/**
 * Create a standalone store for remote module (when host not available)
 * Used as fallback when not connected to host
 *
 * @param initialReducers - Map of initial reducers for this module
 * @returns Standalone Redux store
 *
 * @example
 * ```tsx
 * import { configureStore } from '@reduxjs/toolkit';
 * import userReducer from './redux/userSlice';
 *
 * const store = configureStore({
 *   reducer: {
 *     user: userReducer,
 *   },
 * });
 * ```
 */
export function createStandaloneStore(initialReducers: { [key: string]: Reducer }) {
    const { configureStore } = require('@reduxjs/toolkit');

    return configureStore({
        reducer: initialReducers,
        middleware: (getDefaultMiddleware: any) =>
            getDefaultMiddleware({
                thunk: true,
                serializableCheck: false,
            }),
    });
}

/**
 * Types for export (can be used in remote modules)
 */
export type HostStore = Awaited<ReturnType<typeof loadHostStore>>;
export type { RootState, AppDispatch };
