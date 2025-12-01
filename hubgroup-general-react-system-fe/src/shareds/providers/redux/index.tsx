import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Spin } from 'antd';
import { remoteStore } from './store';

type Props = { children: React.ReactNode };

const ReduxProvider: React.FC<Props> = ({ children }) => {
    const [store, setStore] = useState(remoteStore);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        import('GeneralApplication/store')
            .then(async (mod) => {
                if (mod.storeReady) {
                    const hostStore = await mod.storeReady;
                    if (!cancelled) {
                        setStore(hostStore);
                    }
                } else if (mod.store) {
                    if (!cancelled) setStore(mod.store);
                }
            })
            .catch((err) => {
                console.warn('Host store not found, using local store', err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <Spin spinning={loading} size="large" style={{ width: '100%', height: '100%' }}>
            <Provider store={store}>{children}</Provider>
        </Spin>
    );
};

export default ReduxProvider;
