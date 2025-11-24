import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthPage } from '../modules/auth';

export function PublicRoutes() {
    return (
        <Routes>
            <Route path="/auth" component={AuthPage} />
            <Route path="*" element={<Navigate to="auth" replace />} />
        </Routes>
    );
}
