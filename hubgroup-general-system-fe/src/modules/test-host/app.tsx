import React from 'react';
import ContextProvider from '@hubgroup-share-system-fe/react/providers/context';
import { FederationAppInitProps } from '@hubgroup-share-system-fe/types/federation.type';
import ReduxProvider from 'src/shareds/providers/redux';
import Host from './layouts/host';

type Props = Partial<FederationAppInitProps>;

const App: React.FC<Props> = (props): React.ReactNode => {
    return (
        <ReduxProvider>
            <ContextProvider prefixClass={process.env.PREFIX_CLASS} moduleName={process.env.MODULE_NAME} {...props}>
                <Host />
            </ContextProvider>
        </ReduxProvider>
    );
};

export default App;
