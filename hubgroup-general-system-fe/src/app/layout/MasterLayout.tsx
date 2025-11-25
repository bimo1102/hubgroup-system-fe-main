import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

type MasterLayoutProps = {
    children?: React.ReactNode;
};

const MasterLayout: React.FC<MasterLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Header */}
            <Header onToggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

                {/* Body - Router Outlet */}
                <main
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto',
                        background: '#f5f5f5',
                    }}>
                    <div style={{ flex: 1, padding: 24 }}>{children || <Outlet />}</div>

                    {/* Footer */}
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default MasterLayout;
