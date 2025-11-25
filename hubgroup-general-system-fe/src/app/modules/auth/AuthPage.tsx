/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Registration } from './components/Registration';
import { ForgotPassword } from './components/ForgotPassword';
import { Login } from './components/Login';

export function AuthPage() {
    useEffect(() => {
        document.body.classList.add('bg-white');
        return () => {
            document.body.classList.remove('bg-white');
        };
    }, []);

    return (
        <div className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed">
            <div className="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
                <a href="#" className="mb-12"></a>

                <div className="w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto">
                    <Routes>
                        <Route path="login" element={<Login />} />
                        <Route path="registration" element={<Registration />} />
                        <Route path="forgot-password" element={<ForgotPassword />} />

                        {/* Redirect từ /auth → /auth/login */}
                        <Route index element={<Navigate to="login" replace />} />

                        {/* Redirect fallback */}
                        <Route path="*" element={<Navigate to="login" replace />} />
                    </Routes>
                </div>
            </div>

            <div className="d-flex flex-center flex-column-auto p-10">
                <div className="d-flex align-items-center fw-bold fs-6">
                    <a href="#" className="text-muted text-hover-primary px-2">
                        About
                    </a>
                    <a href="#" className="text-muted text-hover-primary px-2">
                        Contact
                    </a>
                    <a href="#" className="text-muted text-hover-primary px-2">
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
}
