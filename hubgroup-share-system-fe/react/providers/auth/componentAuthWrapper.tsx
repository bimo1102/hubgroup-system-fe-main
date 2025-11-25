import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommonReducerState } from 'types/redux.type';

type Props = Pick<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    permissionKey: string;
    checkPermission: boolean;
};

const ComponentAuthWrapper: React.FC<Props> = ({
    children,
    permissionKey = '',
    checkPermission,
}): React.ReactNode => {
    const { currentUser } = useSelector(
        (state: { common: CommonReducerState }) =>
            state.common.federationResolver
    );
    const [isShow, setIsShow] = useState(false);

    const isCheckShow = () => {
        if (!checkPermission) return true;

        if (currentUser?.isAdministrator) {
            return true;
        }
        const prefixPermissionFinalKey = permissionKey.startsWith('/')
            ? process.env.PREFIX_PERMISSION_KEY
            : process.env.PREFIX_PERMISSION_KEY + '/';

        return !!currentUser?.permissions?.includes(
            `${prefixPermissionFinalKey}${permissionKey}`.toLowerCase()
        );
    };

    useEffect(() => {
        setIsShow(isCheckShow());
    }, [currentUser, permissionKey, checkPermission]);

    if (isShow || process.env.NODE_ENV === 'development') {
        return children;
    }
    return null;
};

export default ComponentAuthWrapper;
