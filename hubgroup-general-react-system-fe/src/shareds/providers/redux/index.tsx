import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { remoteStore } from './store';
import { Spin } from 'antd';
type Props = { children: React.ReactNode };

const ReduxProvider: React.FC<Props> = ({ children }) => {
    const [hostStore, setHostStore] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import('GeneralApplication/store')
            .then((mod) => {
                setHostStore(mod.store);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Failed to load store from host:', error);
                setLoading(false);
            });
    }, []);

    return (
        <Provider store={hostStore ?? remoteStore}>
            <Spin spinning={loading} size="large" tip="Loading Host Redux Store...">
                <>{children}</>
            </Spin>
        </Provider>
    );
};

export default ReduxProvider;
