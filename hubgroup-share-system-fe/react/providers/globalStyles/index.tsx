import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CommonReducerState } from '../../../types/redux.type';
import { FederationAppInitProps } from '../../../types/federation.type';
import './resources/tailwindcss.scss';

type Props = {
    children: React.ReactNode;
} & FederationAppInitProps;

const GlobalStylesProvider: React.FC<Partial<Props>> = ({
    children,
    ...props
}): React.ReactNode => {
    // const federationResolver = useSelector((state: { common: CommonReducerState }) => state.common.federationResolver);

    useEffect(() => {
        if (
            document.documentElement &&
            process.env.NODE_ENV === 'development'
        ) {
            // var defaultThemeMode = "system";
            // var hasKTName = document.body.hasAttribute("data-kt-name");
            // var lsKey = "kt_" + (hasKTName ? name + "_" : "") + "theme_mode_value"
            // var themeMode = localStorage.getItem(lsKey);
            // if (!themeMode) {
            //     if (defaultThemeMode === "system") {
            //         themeMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            //     } else {
            //         themeMode = defaultThemeMode;
            //     }
            // }
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
    }, []);

    // effect handler disable bootrap globalStyles
    useEffect(() => {
        if (!props?.disableGlobalStylesInReactMFE) {
            require('./resources/global-styles.scss');
        }
    }, []);

    return <React.Fragment>{children}</React.Fragment>;
};

export default GlobalStylesProvider;
