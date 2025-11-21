import React from 'react';
import { useTranslation } from 'react-i18next';
import ComponentAuthWrapper from '../../../providers/auth/componentAuthWrapper';
import KeenIconsComponent from '../icons/keenicons';
import classnames from 'classnames';
import { Popconfirm } from 'antd';

type Props = Pick<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> & {
    permissionKey?: string;
    checkPermission?: boolean;
    buttonIcon?: boolean;
    text?: string;
    type?: 'button' | 'submit';
    disabled?: boolean;
    isLoading?: boolean;
    keenIconName?: string;
    keenIconClassName?: string;
    keenIconType?: string;
    kennIconPosition?: 'start' | 'end';
    className?: string;
    buttonClassType?: string;
    style?: React.CSSProperties
    confirmTitle?: string;
    confirmDescription?: string;
    confirmOkText?: string;
    confirmCancelText?: string;
    clickFunc: (e?: any) => void;
    variant?: 'text' | 'contained' | 'outlined' | 'dashed'
};

const ButtonConfirm: React.FC<Props> = ({
    permissionKey,
    checkPermission = true,
    buttonIcon = false,
    text = '',
    type = 'button',
    disabled = false,
    isLoading = false,
    keenIconName = 'abstract-26',
    keenIconClassName = 'fs-4',
    keenIconType = 'outline',
    buttonClassType,
    kennIconPosition = 'start',
    className = '',
    confirmTitle = 'are.you.sure',
    confirmDescription = '',
    confirmOkText = 'Ok',
    confirmCancelText = 'Cancel',
    clickFunc,
    variant = 'contained',
    ...props
}): React.ReactNode => {
    const { t, i18n } = useTranslation();

    return (
        <ComponentAuthWrapper
            permissionKey={permissionKey}
            checkPermission={checkPermission}>
            <Popconfirm
                placement='top'
                title={t(confirmTitle)}
                description={t(confirmDescription)}
                okText={t(confirmOkText)}
                cancelText={t(confirmCancelText)}
                // onCancel={}
                onConfirm={clickFunc}>
                <button
                    className={classnames(
                        'd-flex align-items-center btn btn-shadow btn-sm',
                        {
                            'btn-link btn-color-primary ': variant === 'text' && !buttonClassType,
                            'btn-primary ': variant === 'contained' && !buttonClassType,
                            'btn-outline btn-outline-primary ': variant === 'outlined' && !buttonClassType,
                            'btn-outline btn-outline-dashed btn-outline-primary ': variant === 'dashed' && !buttonClassType,
                            'btn-icon': buttonIcon
                        },
                        className,
                        buttonClassType,
                    )}
                    type={type}
                    disabled={disabled}
                    {...props}>
                    {isLoading ? (
                        <span
                            className='spinner-border spinner-border-sm me-2 '
                            role='status'
                            aria-hidden='true'></span>
                    ) : (
                        keenIconName &&
                        kennIconPosition == 'start' && (
                            <KeenIconsComponent
                                styles={
                                    buttonIcon ? { paddingRight: '0px' } : {}
                                }
                                className={keenIconClassName}
                                name={keenIconName}
                                type={keenIconType}
                            />
                        )
                    )}
                    {!buttonIcon && t(text)}
                    {keenIconName && kennIconPosition == 'end' && (
                        <KeenIconsComponent
                            styles={
                                buttonIcon
                                    ? {
                                        paddingLeft: '0px',
                                        paddingRight: '0px',
                                    }
                                    : {
                                        paddingLeft: '5px',
                                        paddingRight: '0px',
                                    }
                            }
                            className={keenIconClassName}
                            name={keenIconName}
                            type={keenIconType}
                        />
                    )}
                </button>
            </Popconfirm>
        </ComponentAuthWrapper>
    );
};

export default ButtonConfirm;
