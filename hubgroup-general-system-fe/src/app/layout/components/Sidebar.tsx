import React from 'react';
import { useNavigate } from 'react-router-dom';

type SidebarProps = {
    isOpen: boolean;
    onClose?: () => void;
};

const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Users', path: '/users', icon: '👥' },
    { label: 'Products', path: '/products', icon: '📦' },
    { label: 'Orders', path: '/orders', icon: '🛒' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        navigate(path);
        if (onClose) onClose();
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.45)',
                        zIndex: 98,
                    }}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 64,
                    width: 250,
                    height: 'calc(100vh - 64px)',
                    background: '#001529',
                    color: '#fff',
                    padding: '16px 0',
                    overflowY: 'auto',
                    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease',
                    zIndex: 99,
                }}>
                <nav>
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleNavigate(item.path)}
                            style={{
                                width: '100%',
                                padding: '12px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                background: 'none',
                                border: 'none',
                                color: '#fff',
                                fontSize: 14,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                borderLeft: '3px solid transparent',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'none';
                            }}>
                            <span style={{ fontSize: 16 }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
