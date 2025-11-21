import React from 'react';
import ComponentAuthWrapper from '../../../providers/auth/componentAuthWrapper';
import { useTranslation } from 'react-i18next';
import KeenIconsComponent from '../icons/keenicons';
import classNames from 'classnames';
import { Popconfirm } from 'antd';

type Props = Pick<
    React.HTMLAttributes<HTMLButtonElement>,
    'onClick' | 'className'
> & {
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
    buttonConfirm?: boolean;
    confirmTitle?: string;
    okText?: string;
    cancelText?: string;
    buttonClassType?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    style?: React.CSSProperties;
    variant?: 'text' | 'contained' | 'outlined' | 'dashed'
};

const ButtonRefresh: React.FC<Props> = ({
    text = 'Refresh',
    className = '',
    permissionKey,
    checkPermission = true,
    buttonIcon = false,
    type = 'button',
    disabled = false,
    isLoading = false,
    keenIconName = 'arrow-circle-left',
    keenIconClassName = 'fs-3',
    keenIconType = 'outline',
    buttonConfirm = true,
    confirmTitle = 'are.you.sure.refresh',
    okText = 'ok',
    buttonClassType,
    cancelText = 'cancel',
    onCancel = () => { },
    onConfirm = () => { },
    variant = 'contained',
    ...props
}): React.ReactNode => {
    const { t, i18n } = useTranslation();
    const PopConfirmWrapper: React.FC<any> = ({
        children,
    }): React.ReactNode => {
        if (buttonConfirm == true)
            return (
                <Popconfirm
                    title={t(confirmTitle)}
                    okText={t(okText)}
                    cancelText={t(cancelText)}
                    onConfirm={onConfirm}
                    onCancel={onCancel}>
                    {children}
                </Popconfirm>
            );
        return children;
    };
    return (
        <ComponentAuthWrapper
            checkPermission={checkPermission}
            permissionKey={permissionKey}>
            <PopConfirmWrapper>
                <button
                    title={t(text)}
                    className={classNames(
                        'd-flex align-items-center btn btn-shadow btn-sm',
                        {
                            'btn-primary ': variant === 'contained' && !buttonClassType,
                            'btn-link btn-color-primary ': variant === 'text' && !buttonClassType,
                            'btn-outline btn-outline-primary ': variant === 'outlined' && !buttonClassType,
                            'btn-outline btn-outline-dashed btn-outline-primary ': variant === 'dashed' && !buttonClassType,
                            'btn-icon': buttonIcon
                        },
                        className,
                        buttonClassType
                    )}
                    type={type}
                    disabled={disabled || isLoading}
                    {...props}>
                    {isLoading ? (
                        <span
                            className='spinner-border spinner-border-sm me-2 '
                            role='status'
                            aria-hidden='true'></span>
                    ) : (
                        <KeenIconsComponent
                            styles={buttonIcon ? { paddingRight: '0px' } : {}}
                            className={keenIconClassName}
                            name={keenIconName}
                            type={keenIconType}
                        />
                    )}
                    {!buttonIcon && t(text)}
                </button>
            </PopConfirmWrapper>
        </ComponentAuthWrapper>
    );
};

export default ButtonRefresh;
