import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfigProvider, theme, type ThemeConfig } from 'antd';
import { tokenCustomizations } from './resources/token';
import { componentCustomizations } from './resources/components';
import vi_VN from "antd/locale/vi_VN";
import en_US from "antd/locale/en_US";
import { merge } from 'lodash';
import { FederationAppInitProps } from '../../../types/federation.type';
import { ThemeTypeConfigEnum } from '../../../enums/themes.enum';
// import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs';

type Props = {
    prefixClass?: string,
    children: React.ReactNode,
}

const AntdProvider: React.FC<Props> = ({
    children,
    prefixClass,
    ...props
}): React.ReactNode => {
    const { currentTheme } = props as FederationAppInitProps;
    const onInitialThemeConfig = useCallback(() => {
        let moduleConfigurations: ThemeConfig = {};
        if (currentTheme === ThemeTypeConfigEnum.loyaltyTheme) {
            moduleConfigurations = {
                token: {
                    colorPrimary: '#EB0A1B',
                },
                components: {
                    Checkbox: {},
                    Button: {},
                    Table: {},
                    Form: {}
                }
            }
        }
        return merge(
            {
                token: tokenCustomizations,
                components: componentCustomizations,
                algorithm: [theme.defaultAlgorithm],
            },
            moduleConfigurations
        );
    }, []);

    return (
        <div className="react-antd-wrapper">
            <ConfigProvider
                theme={onInitialThemeConfig()}
                locale={en_US}
                prefixCls={prefixClass}
            >
                {children}
            </ConfigProvider>
        </div>
    );
};

export default React.memo(AntdProvider);