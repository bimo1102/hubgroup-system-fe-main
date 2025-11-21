import React from 'react';
import ComponentAuthWrapper from '../../../providers/auth/componentAuthWrapper';
import { useTranslation } from 'react-i18next';
import KeenIconsComponent from '../icons/keenicons';
import classNames from 'classnames';
import { theme } from "antd";

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
    buttonClassType?: string;
    keenIconName?: string;
    keenIconClassName?: string;
    keenIconType?: string;
    style?: React.CSSProperties
    variant?: 'text' | 'contained' | 'outlined' | 'dashed'
};

const ButtonAdd: React.FC<Props> = ({
    className,
    permissionKey,
    checkPermission = true,
    text = 'Add',
    buttonIcon = false,
    type = 'button',
    disabled = false,
    isLoading = false,
    keenIconName = 'plus',
    keenIconClassName = 'fs-4',
    keenIconType = 'outline',
    variant = 'contained',
    buttonClassType,
    ...props
}): React.ReactNode => {
    const { t, i18n } = useTranslation();

    return (
        <ComponentAuthWrapper
            permissionKey={permissionKey}
            checkPermission={checkPermission}>
            <button
                title={t(text)}
                style={{ flexBasis: 'max-content' }}
                className={classNames(
                    'd-flex align-items-center btn btn-shadow btn-sm',
                    {
                        'btn-link btn-color-primary ': variant === 'text' && !buttonClassType,
                        'btn-primary ': variant === 'contained' && !buttonClassType,
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
        </ComponentAuthWrapper>
    );
};

export default ButtonAdd;
