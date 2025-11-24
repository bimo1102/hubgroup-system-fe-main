import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { FallbackView } from '../_metronic/partials/FallbackView';

export function PrivateRoutes() {
    const ServiceCategoryModule = React.lazy(() => import('GeneralReactModule/service-category'));
    return (
        <Suspense fallback={<FallbackView />}>
            <Routes>
                <Route path="/dashboard" element={<ServiceCategoryModule />} />
                <Route path="/menu-test" element={<ServiceCategoryModule />} />

                {/* redirect /auth → /dashboard */}
                <Route path="/auth" element={<Navigate to="/dashboard" replace />} />

                {/* redirect / → /dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* fallback 404 */}
                <Route path="*" element={<Navigate to="/error/404" replace />} />
            </Routes>
        </Suspense>
    );
}
