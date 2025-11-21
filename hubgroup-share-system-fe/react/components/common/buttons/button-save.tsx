import React from 'react';
import ComponentAuthWrapper from '../../../providers/auth/componentAuthWrapper';
import { useTranslation } from 'react-i18next';
import KeenIconsComponent from '../icons/keenicons';
import classNames from 'classnames';

type Props = Pick<React.HTMLAttributes<HTMLButtonElement>, 'onClick' | 'className'> & {
    permissionKey?: string,
    checkPermission?: boolean,
    buttonIcon?: boolean,
    text?: string,
    type?: 'button' | 'submit',
    disabled?: boolean,
    isLoading?: boolean,
    keenIconName?: string,
    keenIconClassName?: string,
    buttonClassType?: string;
    keenIconType?: string,
    style?: React.CSSProperties;
    variant?: 'text' | 'contained' | 'outlined' | 'dashed'
}

const ButtonSave: React.FC<Props> = ({
    text = 'Save',
    className,
    permissionKey,
    checkPermission = true,
    buttonIcon = false,
    type = 'button',
    disabled = false,
    isLoading = false,
    keenIconName = 'directbox-default',
    keenIconClassName = 'fs-4',
    keenIconType = 'outline',
    variant = 'contained',
    buttonClassType,
    ...props
}): React.ReactNode => {
    const { t, i18n } = useTranslation();
    return (
        <ComponentAuthWrapper
            checkPermission={checkPermission}
            permissionKey={permissionKey}>
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
                    }
                    ,className,
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
        </ComponentAuthWrapper >
    )
};

export default ButtonSave;