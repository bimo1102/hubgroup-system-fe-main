import { App as AntdAppProvider, message, Modal } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FederationAppInitProps,
    FederationDataObservableType,
} from '../../../types/federation.type';
import { CommonModalPropsConfiguration } from '../../../types/redux.type';
import { DataObservableTypeEnum } from '../../../enums/federation.enum';
import { MasterLayout } from '../../components/layouts/master-layout';
import AntdProvider from '../antd';
import GlobalStylesProvider from '../globalStyles';
import I18nProvider from '../i18n';
import { commonActions } from './common.reducer';

type Props = {
    children: React.ReactNode;
    moduleName: string;
    prefixClass: string;
} & Partial<FederationAppInitProps>;

// handler notification message, authen, push data from General App -> inject common.slice.ts
const ContextProvider: React.FC<Props> = ({
    children,
    prefixClass,
    moduleName,
    responsive = {} as any,
    ...props
}): React.ReactNode => {
    const dispatch = useDispatch();
    const containerRef = useRef<any>(null);
    const [modal, modalContextHolder] = Modal.useModal();
    const [messages, messageContextHolder] = message.useMessage();
    const federationResolver: FederationAppInitProps = useSelector(
        (state: any) => state.common.federationResolver
    );
    const defaultClassNameModalId = 'react-mfe-modal-refer';
    let lastScroll = 0;
    const onHandleModelOpenChange = (isOpen: boolean) => {
        const styleElmQuery = document.head.querySelectorAll(
            `.${defaultClassNameModalId}`
        );
        const htmlElement = document.querySelector<HTMLElement>(
            'html'
        ) as HTMLElement;
        if (isOpen == true) {
            if (styleElmQuery.length == 0) {
                lastScroll = window.scrollY;
                const styleElement = document.createElement('style');
                styleElement.classList.add(defaultClassNameModalId);
                const isScroll =
                    document.body.scrollHeight > document.body.clientHeight;
                htmlElement.style.top = `-${lastScroll}px`;
                styleElement.innerHTML = `
                html {
                    overflow-y: ${isScroll ? 'scroll' : 'auto'};
                    width: 100%;
                    position: fixed;
                }`;
                document.head.appendChild(styleElement);
            }
        } else {
            setTimeout(() => {
                if (containerRef.current.children.length == 0) {
                    [...styleElmQuery].forEach(elm => {
                        document.head.removeChild(elm);
                    });
                    htmlElement.style = '';
                    window.scrollTo({
                        top: lastScroll,
                    });
                }
            }, 1);
        }
    };

    const onShowDialogModalSmall = (params: CommonModalPropsConfiguration) => {
        const {
            title,
            component: Component,
            afterClose = () => {},
            closable = false,
            data = {},
            dataUi = {},
        } = params;

        const reference = modal.info({
            afterClose: afterClose,
            icon: null,
            width:
                dataUi.width ||
                (responsive.isXl ? '50%' : responsive.isLg ? '70%' : '90%'),
            footer: null,
            // destroyOnClose: true,
            centered: true,
            closable: closable,
            maskClosable: false,
            zIndex: 900,
            content: null,
            getContainer: containerRef.current,
            styles: {
                content: {
                    padding: '15px',
                    paddingRight: '3px',
                },
            },
            afterOpenChange: onHandleModelOpenChange,
        });
        reference.update({
            content: <Component modalRef={{ ...reference, data: data }} />,
        });
    };

    const onShowDialogModalMedium = (params: CommonModalPropsConfiguration) => {
        const {
            component: Component,
            afterClose = () => {},
            closable = false,
            data = {},
            width,
        } = params;

        const reference = modal.info({
            afterClose: afterClose,
            icon: null,
            // destroyOnClose: true,
            width: width || (responsive.isXXl ? '75%' : '90%'),
            footer: null,
            centered: true,
            closable: closable,
            maskClosable: false,
            zIndex: 900,
            content: null,
            getContainer: containerRef.current,
            styles: {
                content: {
                    padding: '15px',
                    paddingRight: '3px',
                },
            },
            afterOpenChange: onHandleModelOpenChange,
            // prefixCls: 'modal-wrapper-react'
        });
        reference.update({
            content: <Component modalRef={{ ...reference, data: data }} />,
        });
    };

    const onShowDialogModalLarge = (params: CommonModalPropsConfiguration) => {
        const {
            component: Component,
            afterClose = () => {},
            closable = false,
            data = {},
            width = '90%',
            dataUi,
        } = params;
        const reference = modal.info({
            afterClose: afterClose,
            icon: null,
            width: width,
            footer: null,
            // destroyOnClose: true,
            centered: true,
            closable: closable,
            maskClosable: false,
            zIndex: 900,
            content: null,
            getContainer: containerRef.current,
            styles: {
                content: dataUi?.paddingContent || {
                    padding: '15px',
                    paddingRight: '3px',
                },
            },
            afterOpenChange: onHandleModelOpenChange,
        });
        reference.update({
            content: <Component modalRef={{ ...reference, data: data }} />,
        });
    };

    useEffect(() => {
        // handler props FederationAppInitProps;
        dispatch(
            commonActions.onGetFederationResolver(
                props as FederationAppInitProps
            )
        );
        // init module configuration
        dispatch(
            commonActions.onInitModuleConfig({
                appVersion: process.env.APP_VERSION,
                prefixClass: process.env.PREFIX_CLASS,
                moduleName: process.env.MODULE_NAME,
            })
        );
        let subscribe: any = null;
        if (props.data$) {
            subscribe = props.data$.subscribe(
                (event: FederationDataObservableType) => {
                    if (event.type == DataObservableTypeEnum.ChangeUser) {
                        dispatch(commonActions.setUserInfo(event.data));
                    }
                    if (event.type == DataObservableTypeEnum.ChangeParamUrl) {
                        dispatch(
                            commonActions.onUpdateParams(event.data.params)
                        );
                    }
                    if (
                        event.type ==
                        DataObservableTypeEnum.ChangeDealersHasPermission
                    ) {
                        dispatch(
                            commonActions.setDealersHasPermission(
                                event.data || []
                            )
                        );
                    }
                }
            );
        }

        // push modal handler to context store;
        dispatch(
            commonActions.initConfig({
                onShowDialogModalLarge,
                onShowDialogModalMedium,
                onShowDialogModalSmall,
            })
        );

        return () => {
            if (subscribe) {
                subscribe.unsubscribe();
            }
        };
    }, []);

    return (
        <AntdProvider {...props} prefixClass={prefixClass}>
            <AntdAppProvider>
                <I18nProvider moduleName={moduleName}>
                    <GlobalStylesProvider {...props}>
                        <MasterLayout
                            messages={messages}
                            responsive={responsive}
                            {...(props as any)}>
                            <div className='context-provider'>
                                <div
                                    ref={containerRef}
                                    className='container-modal-ref'></div>
                                <div className='message-wrapper'>
                                    {messageContextHolder}
                                </div>
                                <div className='modal-context-wrapper'>
                                    {modalContextHolder}
                                </div>
                                {props && Object.keys(props).length > 0
                                    ? federationResolver &&
                                      Object.keys(federationResolver).length >
                                          0 &&
                                      children
                                    : children}
                            </div>
                        </MasterLayout>
                    </GlobalStylesProvider>
                </I18nProvider>
            </AntdAppProvider>
        </AntdProvider>
    );
};

export default ContextProvider;
