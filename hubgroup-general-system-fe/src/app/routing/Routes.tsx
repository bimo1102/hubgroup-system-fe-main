import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MasterLayout } from '../_metronic/layout/MasterLayout';
import { Logout, AuthPage } from '../modules/auth';
import { ErrorsPage } from '../modules/errors/ErrorsPage';
import { privateRoutes } from './PrivateRoutes';

export function AppRoutes() {
    const isAuthorized = true; // hoặc lấy từ Redux/AuthContext

    const router = createBrowserRouter([
        // Public Area
        {
            path: '/auth/*',
            element: !isAuthorized ? <AuthPage /> : <Navigate to="/dashboard" replace />,
        },

        // Private Area
        {
            path: '/',
            element: isAuthorized ? <MasterLayout children={''} /> : <Navigate to="/auth/login" replace />,
            children: privateRoutes,
        },

        // Error pages
        {
            path: '/error/*',
            element: <ErrorsPage />,
        },

        // Logout
        {
            path: '/logout',
            element: <Logout />,
        },

        // Root redirect
        {
            index: true,
            element: <Navigate to={isAuthorized ? '/dashboard' : '/auth/login'} replace />,
        },

        // Catch-all
        {
            path: '*',
            element: <Navigate to="/error/404" replace />,
        },
    ]);

    return <RouterProvider router={router} />;
}
