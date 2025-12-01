import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import FallbackView from '@app/partials/FallbackView';
import { safeRemoteLoader } from '@shareds/utils/safeRemoteLoader';

const ServiceCategoryModule = lazy(safeRemoteLoader(() => import('GeneralReactModule/service-category')));
export const privateRoutes = [
    {
        path: 'dashboard',
        element: (
            <Suspense fallback={<FallbackView />}>
                <ServiceCategoryModule />
            </Suspense>
        ),
    },
    {
        path: 'users',
        element: (
            <Suspense fallback={<FallbackView />}>
                <ServiceCategoryModule />
            </Suspense>
        ),
    },
    {
        path: 'menu-test',
        element: (
            <Suspense fallback={<FallbackView />}>
                <ServiceCategoryModule />
            </Suspense>
        ),
    },
    {
        index: true,
        element: <Navigate to="/dashboard" replace />,
    },
    {
        path: '*',
        element: <Navigate to="/error/404" replace />,
    },
];
