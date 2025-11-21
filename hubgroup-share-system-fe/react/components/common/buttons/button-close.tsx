import React from 'react';
import ComponentAuthWrapper from '../../../providers/auth/componentAuthWrapper';
import { useTranslation } from 'react-i18next';
import KeenIconsComponent from '../icons/keenicons';
import classNames from 'classnames';

type Props = Pick<React.HTMLAttributes<HTMLButtonElement>, 'onClick' | 'className'> & {
    permissionKey?: string,
    buttonIcon?: boolean,
    text?: string,
    type?: 'button' | 'submit',
    disabled?: boolean,
    isLoading?: boolean,
    keenIconName?: string,
    keenIconClassName?: string,
    buttonClassType?: string;
    keenIconType?: string,
    style?: React.CSSProperties
    variant?: 'text' | 'contained' | 'outlined' | 'dashed'
}

const ButtonClose: React.FC<Props> = ({
    className,
    permissionKey,
    text = 'Close',
    buttonIcon = false,
    type = 'button',
    disabled = false,
    isLoading = false,
    keenIconName = 'cross',
    keenIconClassName = 'fs-2',
    keenIconType = 'outline',
    variant = 'contained',
    buttonClassType,
    ...props
}): React.ReactNode => {
    const { t, i18n } = useTranslation();
    return (
        <ComponentAuthWrapper checkPermission={false}
            permissionKey={permissionKey}>
            <button
                title={t(text)}
                className={classNames(
                    'btn btn-shadow btn-sm',
                    {
                        'btn-secondary': variant === 'contained' && !buttonClassType,
                        'btn-link btn-color-secondary ': variant === 'text' && !buttonClassType,
                        'btn-outline btn-outline-dark ': variant === 'outlined' && !buttonClassType,
                        'btn-outline btn-outline-dashed btn-outline-dark ': variant === 'dashed' && !buttonClassType,
                        'btn-icon': buttonIcon
                    },
                    className,
                    buttonClassType
                )}
                type={type}
                disabled={disabled || isLoading}
                {...props}>
                {isLoading ? (
                    <span className="spinner-border spinner-border-sm me-2 " role="status" aria-hidden="true"></span>
                ) : (
                    <KeenIconsComponent
                        styles={buttonIcon ? { paddingRight: '0px' } : {}}
                        className={keenIconClassName}
                        name={keenIconName}
                        type={keenIconType}
                    />
                )}
                {!buttonIcon && (t(text))}
            </button>
        </ComponentAuthWrapper>
    )
};

export default ButtonClose;