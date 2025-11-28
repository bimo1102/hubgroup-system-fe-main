import { useEffect } from 'react';
import { Reducer, Action } from 'redux';
import { injectReducer, ejectReducer, hasReducer } from '../providers/redux/store';

/**
 * Hook for injecting/ejecting reducers dynamically (for remote modules)
 * Automatically cleans up when component unmounts
 *
 * @param key - Unique key for the reducer
 * @param reducer - Reducer function to inject
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * // In remote module component
 * import { useInjectReducer } from 'src/app/shareds/hooks/useInjectReducer';
 * import userReducer from './redux/userSlice';
 *
 * export const UserModule = () => {
 *   useInjectReducer('user', userReducer, { cleanup: true });
 *   // Component can now use Redux state: state.user
 * };
 * ```
 */
export function useInjectReducer<S = any, A extends Action = Action>(
    key: string,
    reducer: Reducer<S, A>,
    options?: {
        cleanup?: boolean; // Auto-cleanup on unmount (default: true)
        overwrite?: boolean; // Force overwrite if already exists (default: false)
    }
): boolean {
    const { cleanup = true, overwrite = false } = options || {};

    useEffect(() => {
        // Skip if already injected and not forcing overwrite
        if (!overwrite && hasReducer(key)) {
            console.info(`[useInjectReducer] Reducer "${key}" already injected`);
            return () => {};
        }

        // Remove first if overwriting
        if (overwrite && hasReducer(key)) {
            ejectReducer(key);
        }

        // Inject reducer
        const injected = injectReducer(key, reducer);

        if (!injected) {
            console.error(`[useInjectReducer] Failed to inject reducer "${key}"`);
        }

        // Cleanup on unmount
        return () => {
            if (cleanup && hasReducer(key)) {
                ejectReducer(key);
                console.info(`[useInjectReducer] Cleaned up reducer "${key}"`);
            }
        };
    }, [key, reducer, cleanup, overwrite]);

    return hasReducer(key);
}
