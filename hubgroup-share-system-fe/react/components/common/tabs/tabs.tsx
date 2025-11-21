import React from 'react';
import { Tabs } from 'antd';

type TabItem = {
    key: string;
    label: React.ReactNode;
    content: React.ReactNode;
};

type TabProps = {
    items: TabItem[];
    activeKey?: string;
    onChange?: (activeKey: string) => void;
    className?: string;
    type?: 'card' | 'line' | 'editable-card';
};

const CustomTabs: React.FC<TabProps> = ({
    items,
    activeKey,
    onChange,
    className,
    type,
}) => {
    return (
        <Tabs
            className={className}
            type={type}
            activeKey={activeKey}
            onChange={onChange}
            items={items.map(item => ({
                label: item.label,
                key: item.key,
                children: item.content,
            }))}
        />
    );
};

export default CustomTabs;
