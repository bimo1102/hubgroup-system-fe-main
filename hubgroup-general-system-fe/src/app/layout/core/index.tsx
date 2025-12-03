import React, { FC } from 'react';

type LayoutProviderProps = { children: React.ReactNode };

export const LayoutProvider: FC<LayoutProviderProps> = ({ children }) => {
    return <>{children}</>;
};

export const LayoutSplashScreen: FC = () => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100vw',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}>
            <div style={{ textAlign: 'center' }}>
                <div
                    className="spinner"
                    style={{
                        marginBottom: 24,
                        animation: 'spin 1s linear infinite',
                    }}>
                    <svg
                        width="50"
                        height="50"
                        viewBox="0 0 50 50"
                        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}>
                        <circle
                            cx="25"
                            cy="25"
                            r="20"
                            stroke="#fff"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray="62.83 62.83"
                        />
                    </svg>
                </div>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 500 }}>Loading Application...</div>
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LayoutProvider;
