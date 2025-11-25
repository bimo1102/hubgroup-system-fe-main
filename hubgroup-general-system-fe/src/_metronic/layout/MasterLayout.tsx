import React from 'react';
import { MasterLayout as SharedMasterLayout } from '@hubgroup-share-system-fe/react/components/layouts/master-layout';

type Props = {
    children: React.ReactNode;
    messages?: any;
};

const Header: React.FC = () => (
    <header style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        background: '#001529',
        color: '#fff'
    }}>
        <div style={{ fontWeight: 600 }}>HubGroup</div>
        <div style={{ marginLeft: 16, opacity: 0.85 }}>General Application</div>
    </header>
);

const Footer: React.FC = () => (
    <footer style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
        color: '#000'
    }}>
        <div style={{ fontSize: 12 }}>© {new Date().getFullYear()} HubGroup</div>
    </footer>
);

const LayoutContainer: React.FC<Props> = ({ children, messages, ...rest }) => {
    return (
        <SharedMasterLayout messages={messages} {...(rest as any)}>
            <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
                <Header />
                <main style={{ flex: 1, padding: 16 }}>{children}</main>
                <Footer />
            </div>
        </SharedMasterLayout>
    );
};

export { LayoutContainer as MasterLayout };
export default LayoutContainer;
