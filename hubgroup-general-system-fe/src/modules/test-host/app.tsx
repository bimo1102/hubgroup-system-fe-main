import React, { Suspense } from 'react';
import ContextProvider from '@hubgroup-share-system-fe/react/providers/context';
import { FederationAppInitProps } from '@hubgroup-share-system-fe/types/federation.type';
import ReduxProvider from 'src/shareds/providers/redux';
import { LayoutProvider, LayoutSplashScreen } from 'src/_metronic/layout/core';
import { BrowserRouter } from 'react-router-dom';
import AuthInit from '../auth/redux/AuthInit';
import { AppRoutes } from 'src/routing/Routes';

type Props = Partial<FederationAppInitProps>;

const App: React.FC<Props> = (props): React.ReactNode => {
    return (
        <ReduxProvider>
            <ContextProvider prefixClass={process.env.PREFIX_CLASS} moduleName={process.env.MODULE_NAME} {...props}>
                <Suspense fallback={<LayoutSplashScreen />}>
                    <LayoutProvider>
                        <AuthInit>
                            <AppRoutes />
                        </AuthInit>
                    </LayoutProvider>
                </Suspense>
            </ContextProvider>
        </ReduxProvider>
    );
};

export default App;
