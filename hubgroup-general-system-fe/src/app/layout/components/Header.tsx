import React from 'react';
import { useAppSelector } from '@shareds/hooks/useAppStore';
type HeaderProps = {
    onToggleSidebar?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
    const value = useAppSelector((state) => state?.myRemote?.value) ?? 0;
    return (
        <header
            style={{
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                background: '#fff',
                borderBottom: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                zIndex: 100,
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Menu Toggle Button */}
                <button
                    onClick={onToggleSidebar}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 20,
                        cursor: 'pointer',
                        color: '#001529',
                        padding: 8,
                    }}>
                    ☰
                </button>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: 18,
                        }}>
                        HG
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: '#001529', fontSize: 14 }}>HubGroup</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>Admin Panel</div>
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Notification Icon */}
                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 18,
                        cursor: 'pointer',
                        color: '#595959',
                    }}>
                    🔔{value}
                </button>

                {/* User Menu */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        paddingLeft: 16,
                        borderLeft: '1px solid #f0f0f0',
                    }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: '#667eea',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 600,
                        }}>
                        U
                    </div>
                    <div style={{ fontSize: 12, color: '#001529' }}>
                        <div style={{ fontWeight: 500 }}>User Name</div>
                        <div style={{ color: '#8c8c8c', fontSize: 11 }}>Admin</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
