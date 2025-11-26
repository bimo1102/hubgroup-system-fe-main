/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Error500 } from './components/Error500';
import { Error404 } from './components/Error404';

const ErrorsPage: React.FC = () => {
    const navigate = useNavigate();
    const redirectToDashboard = () => {
        navigate('/');
    };

    return (
        <div className="d-flex flex-column flex-root">
            <div className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed">
                <div className="d-flex flex-column flex-column-fluid text-center p-10 py-lg-20">
                    <a href="/dashboard" className="mb-10 pt-lg-20"></a>

                    <div className="pt-lg-10 mb-10">
                        <Routes>
                            <Route path="/404" element={<Error404 />} />
                            <Route path="/500" element={<Error500 />} />

                            {/* /error → /error/404 */}
                            <Route path="/" element={<Navigate to="/error/404" replace />} />

                            {/* fallback */}
                            <Route path="*" element={<Navigate to="/error/404" replace />} />
                        </Routes>

                        <div className="text-center">
                            <a onClick={redirectToDashboard} className="btn btn-lg btn-primary fw-bolder">
                                Go to homepage
                            </a>
                        </div>
                    </div>

                    <div
                        className="
                            d-flex flex-row-auto
                            bgi-no-repeat
                            bgi-position-x-center
                            bgi-size-contain
                            bgi-position-y-bottom
                            min-h-100px min-h-lg-350px
                        "></div>
                </div>

                <div className="d-flex flex-center flex-column-auto p-10">
                    <div className="d-flex align-items-center fw-bold fs-6">
                        <a href="https://keenthemes.com" className="text-muted text-hover-primary px-2">
                            About
                        </a>
                        <a href="mailto:support@keenthemes.com" className="text-muted text-hover-primary px-2">
                            Contact
                        </a>
                        <a href="https://1.envato.market/EA4JP" className="text-muted text-hover-primary px-2">
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ErrorsPage };
