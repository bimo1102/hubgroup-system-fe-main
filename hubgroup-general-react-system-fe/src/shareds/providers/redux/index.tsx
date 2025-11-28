import React, { Suspense, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { remoteStore } from './store';
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
    return <Provider store={hostStore ?? remoteStore}>{children}</Provider>;
};

export default ReduxProvider;
