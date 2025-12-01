import React from 'react';

export function safeRemoteLoader<T>(loader: () => Promise<T>) {
    return async () => {
        try {
            return await loader();
        } catch (err) {
            console.error('Cannot load remote module:', err);
            return {
                default: () => (
                    <div>Module is unavailable (remote offline)</div>
                ),
            } as T;
        }
    };
}
