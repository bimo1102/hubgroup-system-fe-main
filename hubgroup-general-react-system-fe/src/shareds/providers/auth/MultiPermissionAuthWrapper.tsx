import React, { useMemo } from 'react';
import { useAppSelector } from 'src/hooks/useAppStore';
import { ECareTicketRoleEnum } from '@hubgroup-share-system-fe/enums/ecare-ticket.enum';

type Props = Pick<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    permissionKeys: ECareTicketRoleEnum[];
    checkPermission: boolean;
};

const MultiPermissionAuthWrapper: React.FC<Props> = ({
    children,
    permissionKeys = [],
    checkPermission,
}): React.ReactNode => {
    const userPermissions = useAppSelector((state) => state.ecareTiket.role);
    const isShow = useMemo(() => {
        if (!checkPermission) return true;
        if (!userPermissions) return false;

        return permissionKeys.includes(userPermissions);
    }, [checkPermission, userPermissions, permissionKeys]);

    return isShow ? children : null;
};

export default MultiPermissionAuthWrapper;
