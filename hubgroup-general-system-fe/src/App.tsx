import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LayoutProvider, LayoutSplashScreen } from './_metronic/layout/core';
import AuthInit from './modules/auth/redux/AuthInit';
import { AppRoutes } from './routing/Routes';

type Props = {
    basename: string;
};

const App: React.FC<Props> = ({ basename }) => {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
            <BrowserRouter basename={basename}>
                <LayoutProvider>
                    <AuthInit>
                        <AppRoutes />
                    </AuthInit>
                </LayoutProvider>
            </BrowserRouter>
        </Suspense>
    );
};

export { App };
