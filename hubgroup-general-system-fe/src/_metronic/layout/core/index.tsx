import React from 'react';

type LayoutProviderProps = { children: React.ReactNode };

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
    return <>{children}</>;
};

export const LayoutSplashScreen: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
            background: '#fff'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ marginBottom: 12 }}>
                    <svg width="40" height="40" viewBox="0 0 50 50">
                        <circle cx="25" cy="25" r="20" stroke="#1890ff" strokeWidth="5" fill="none" strokeLinecap="round"/>
                    </svg>
                </div>
                <div>Loading...</div>
            </div>
        </div>
    );
};

export default LayoutProvider;
