import React from 'react';
import ContextProvider from '@hubgroup-share-system-fe/react/providers/context';
import { FederationAppInitProps } from '@hubgroup-share-system-fe/types/federation.type';
import ServiceCategoryList from './layouts/ServiceCategoryList';
import ReduxProvider from '@shareds/providers/redux';

type Props = Partial<FederationAppInitProps>;

const App: React.FC<Props> = (props): React.ReactNode => {
    return (
        <ReduxProvider>
            <ContextProvider prefixClass={process.env.PREFIX_CLASS} moduleName={process.env.MODULE_NAME} {...props}>
                <ServiceCategoryList />
            </ContextProvider>
        </ReduxProvider>
    );
};

export default App;
