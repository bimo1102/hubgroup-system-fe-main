import React from 'react';

const FallbackView: React.FC = () => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                color: '#8c8c8c',
                fontSize: 14,
            }}>
            <div style={{ textAlign: 'center' }}>
                <div
                    style={{
                        marginBottom: 16,
                        fontSize: 24,
                        animation: 'spin 1s linear infinite',
                    }}>
                    ⏳
                </div>
                <div>Loading module...</div>
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default FallbackView;
