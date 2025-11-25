import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18nConfiguration';
import {
    FederationAppInitProps,
    FederationDataObservableType,
} from '../../../types/federation.type';
import { useDispatch, useSelector } from 'react-redux';
import { CommonReducerState } from '../../../types/redux.type';
import { DataObservableTypeEnum } from '../../../enums/federation.enum';
import { onGetsLocaleResourcesByLanguage } from '../context/common.action';
import commonService from '../../services/common.service';

type Props = {
    children: React.ReactNode;
    moduleName: string;
};

const I18nProvider: React.FC<Props> = ({
    children,
    moduleName,
}): React.ReactNode => {
    const dispatch = useDispatch<any>();
    const federationResolver = useSelector(
        (state: Record<'common', CommonReducerState>) =>
            state.common.federationResolver
    );
    const [currentLanguage, setCurrentLanguage] = useState<string>(null);
    // const [isResolveSuccess, setResolveSuccess] = useState(false);

    useEffect(() => {
        if (Object.keys(federationResolver).length > 0) {
            if (federationResolver.localeResources) {
                i18n.addResourceBundle(
                    federationResolver.currentLanguageSelected,
                    'translation',
                    federationResolver.localeResources
                );
                i18n.changeLanguage(federationResolver.currentLanguageSelected);
                // setResolveSuccess(true);
            } else {
                if (currentLanguage) {
                    (async () => {
                        // Đoạn này 2 tháng trước xảy ra lỗi khi dispatch federationResolver nên chuyển qua async tại đây
                        const response =
                            await commonService.onGetsLocaleResourcesByLanguage(
                                {
                                    lang: currentLanguage,
                                    module: process.env.LOCALE_MODULE_KEY,
                                }
                            );
                        const model = response?.data?.data;
                        if (model) {
                            i18n.addResourceBundle(
                                currentLanguage,
                                'translation',
                                model
                            );
                            i18n.changeLanguage(currentLanguage);
                            federationResolver.updateLocale(
                                federationResolver.moduleLocaleKey,
                                model
                            );
                        }
                        // setResolveSuccess(true);
                    })();
                }
            }
        }
    }, [federationResolver, currentLanguage]);

    // Effect Observable subscribe language changes
    useEffect(() => {
        let subscribe = null;
        if (Object.keys(federationResolver).length > 0) {
            if (federationResolver.data$) {
                subscribe = federationResolver.data$.subscribe(
                    (data: FederationDataObservableType) => {
                        if (
                            data.type == DataObservableTypeEnum.ChangeLanguage
                        ) {
                            setCurrentLanguage(data.data);
                        }
                    }
                );
            }
        }
        return () => {
            if (subscribe) {
                subscribe.unsubscribe();
            }
        };
    }, [federationResolver]);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default React.memo(I18nProvider);
