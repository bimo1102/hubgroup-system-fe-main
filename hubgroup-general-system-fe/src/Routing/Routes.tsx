import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MasterLayout } from '../_metronic/layout/MasterLayout';
import { Logout, AuthPage } from '../modules/auth';
import { ErrorsPage } from '../modules/errors/ErrorsPage';
import { privateRoutes } from './PrivateRoutes';

export function AppRoutes() {
    const isAuthorized = true;

    const router = createBrowserRouter([
        // Redirect "/" → /dashboard
        {
            path: '/',
            element: isAuthorized ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth/login" replace />,
        },

        // Public
        ...(!isAuthorized
            ? [
                  {
                      path: '/auth/*',
                      element: <AuthPage />,
                  },
              ]
            : []),

        // Error page
        {
            path: '/error/*',
            element: <ErrorsPage />,
        },

        // Logout
        {
            path: '/logout',
            element: <Logout />,
        },

        // Private area
        ...(isAuthorized
            ? [
                  {
                      path: '/',
                      element: <MasterLayout />,
                      children: privateRoutes,
                  },
              ]
            : []),
    ]);

    return <RouterProvider router={router} />;
}
