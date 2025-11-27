import React, { Suspense } from 'react';
import ContextProvider from '@hubgroup-share-system-fe/react/providers/context';
import { FederationAppInitProps } from '@hubgroup-share-system-fe/types/federation.type';
import ReduxProvider from '@shareds/providers/redux';
import { AppRoutes } from '@routing/Routes';
import { LayoutProvider, LayoutSplashScreen } from '@app/layout/core';

type Props = Partial<FederationAppInitProps>;

const App: React.FC<Props> = (props): React.ReactNode => {
    return (
        <ReduxProvider>
            <ContextProvider prefixClass={process.env.PREFIX_CLASS} moduleName={process.env.MODULE_NAME} {...props}>
                <LayoutProvider>
                    <Suspense fallback={<LayoutSplashScreen />}>
                        {/* <AuthInit> */}
                        <AppRoutes />
                        {/* </AuthInit> */}
                    </Suspense>
                </LayoutProvider>
            </ContextProvider>
        </ReduxProvider>
    );
};

export default App;
