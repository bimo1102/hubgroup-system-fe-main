import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            style={{
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                background: '#fafafa',
                borderTop: '1px solid #f0f0f0',
                fontSize: 12,
                color: '#595959',
            }}>
            <div>© {currentYear} HubGroup. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 24 }}>
                <a
                    href="#"
                    style={{
                        color: '#595959',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#1890ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#595959')}>
                    Privacy Policy
                </a>
                <a
                    href="#"
                    style={{
                        color: '#595959',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#1890ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#595959')}>
                    Terms of Service
                </a>
                <a
                    href="#"
                    style={{
                        color: '#595959',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#1890ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#595959')}>
                    Contact
                </a>
            </div>
        </footer>
    );
};

export default Footer;
