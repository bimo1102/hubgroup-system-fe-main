import { Reducer, combineReducers, Action, AnyAction } from 'redux';

/**
 * Represents a map of reducer functions
 */
export type ReducersMapObject<State = any, A extends Action = AnyAction> = {
    [key: string]: Reducer<any, A>;
};

/**
 * Represents the reducer manager interface
 * Manages dynamic reducer injection and ejection
 */
export interface ReducerManager<State = any, A extends Action = AnyAction> {
    reduce: Reducer<any, A>;
    add: <K extends string, S>(key: K, reducer: Reducer<S, A>) => boolean;
    remove: (key: string) => boolean;
    getReducers: () => ReducersMapObject<State, A>;
    has: (key: string) => boolean;
}

/**
 * Creates a reducer manager for dynamic reducer injection/ejection
 *
 * Enterprise-grade implementation supporting:
 * - Dynamic reducer registration (for remote modules)
 * - Reducer replacement and removal
 * - Type-safe add/remove operations
 * - Observable pattern for reducer changes
 *
 * @param initialReducers - Initial reducers map
 * @returns ReducerManager instance
 *
 * @example
 * ```tsx
 * const manager = createReducerManager({ common: commonReducer });
 *
 * // Inject reducer from remote module
 * manager.add('users', usersReducer);
 *
 * // Use in store
 * const store = configureStore({
 *   reducer: manager.reduce,
 * });
 *
 * // Replace store when reducer changes
 * store.replaceReducer(manager.reduce);
 * ```
 */
export function createReducerManager<State = any, A extends Action = AnyAction>(
    initialReducers: ReducersMapObject<State, A>
): ReducerManager<State, A> {
    // Track registered reducers
    const reducers: ReducersMapObject<State, A> = { ...initialReducers };

    // Track observer callbacks for reducer changes
    const observers: Set<() => void> = new Set();

    // Current combined reducer
    let combinedReducer = combineReducers(reducers);

    /**
     * Notify all observers of reducer changes
     */
    const notifyObservers = () => {
        observers.forEach((callback) => callback());
    };

    /**
     * Rebuild combined reducer and notify observers
     */
    const rebuildCombinedReducer = () => {
        combinedReducer = combineReducers(reducers);
        notifyObservers();
    };

    return {
        /**
         * The main reduce function used by Redux store
         */
        reduce: (state: State | undefined, action: A) => {
            return combinedReducer(state, action);
        },

        /**
         * Add a new reducer (typically from remote module)
         * @param key - Unique key for the reducer
         * @param reducer - Reducer function
         * @returns true if added, false if already exists
         */
        add: (key, reducer) => {
            if (!key || !reducer) {
                console.warn(`[ReducerManager] Invalid add: key="${key}", reducer="${reducer}"`);
                return false;
            }

            if (reducers[key]) {
                console.warn(`[ReducerManager] Reducer "${key}" already exists. Skipping.`);
                return false;
            }

            reducers[key] = reducer;
            rebuildCombinedReducer();
            console.log(`[ReducerManager] Added reducer "${key}"`);
            return true;
        },

        /**
         * Remove a reducer (for cleanup)
         * @param key - Reducer key to remove
         * @returns true if removed, false if not found
         */
        remove: (key) => {
            if (!key || !reducers[key]) {
                console.warn(`[ReducerManager] Reducer "${key}" not found. Skipping removal.`);
                return false;
            }

            delete reducers[key];
            rebuildCombinedReducer();
            console.log(`[ReducerManager] Removed reducer "${key}"`);
            return true;
        },

        /**
         * Check if a reducer exists
         * @param key - Reducer key
         * @returns true if exists, false otherwise
         */
        has: (key) => {
            return key in reducers;
        },

        /**
         * Get all registered reducers (copy)
         * @returns Map of all reducers
         */
        getReducers: () => ({ ...reducers }),
    };
}
