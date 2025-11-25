import React, { Suspense, useState, useEffect } from 'react';
import { Provider } from 'react-redux';

type Props = { children: React.ReactNode };

const ReduxProvider: React.FC<Props> = ({ children }) => {
    const [store, setStore] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        import('GeneralApplication/store')
            .then((mod) => {
                console.log('Module loaded:', mod);
                setStore(mod.store);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Failed to load store from host:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading Redux Store...</div>;
    if (!store) return <div>Failed to load Redux Store from host</div>;

    return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
