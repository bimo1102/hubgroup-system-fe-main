import React, { useState } from 'react';
import { Tabs } from 'antd';

type TabsProps = {
    statuses: Record<string, number>;
    renderTabContent: (status: string) => React.ReactNode;
    defaultStatus?: string;
    onTabChange?: (status: string) => void;
};

const Tabscard: React.FC<TabsProps> = ({
    statuses,
    renderTabContent,
    defaultStatus,
    onTabChange,
}) => {
    const statusKeys = Object.keys(statuses);
    const [activeKey, setActiveKey] = useState<string>(
        defaultStatus || statusKeys[0]
    );

    const handleChange = (key: string) => {
        setActiveKey(key);
        onTabChange?.(key);
    };

    return (
        <Tabs
            type='card'
            activeKey={activeKey}
            onChange={handleChange}
            items={statusKeys.map(status => ({
                label: `${status.charAt(0).toUpperCase() + status.slice(1)} ${
                    statuses[status] !== null && statuses[status] !== undefined
                        ? `(${statuses[status]})`
                        : ''
                }`,
                key: status,
                children: renderTabContent(status),
            }))}
        />
    );
};

export default Tabscard;
