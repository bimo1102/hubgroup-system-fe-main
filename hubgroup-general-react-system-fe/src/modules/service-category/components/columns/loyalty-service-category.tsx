import { Space, TableColumnsType, Tag } from 'antd';
import { TFunction } from 'i18next';
import React from 'react';

import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import ButtonAdd from '@hubgroup-share-system-fe/react/components/common/buttons/button-add';
import ButtonChange from '@hubgroup-share-system-fe/react/components/common/buttons/button-change';
import ButtonConfirm from '@hubgroup-share-system-fe/react/components/common/buttons/button-confirm';
import ButtonRefresh from '@hubgroup-share-system-fe/react/components/common/buttons/button-refresh';
import { Option } from '@hubgroup-share-system-fe/types/common.type';

const statusColorMap: Record<number, string> = {
    [StatusEnum.Active]: 'green',
    [StatusEnum.InActive]: 'red',
};

export const getloyaltyServiceCategoryColumns = (
    t: TFunction,
    onOpenAddOrChangeModal: (data?: any) => void,
    onRemove: (id?: string) => void,
    onOpenImportJob: (data?: any) => void,
    onOpenImportSparePart: (data?: any) => void,
    sortField?: string,
    sortType?: string
): TableColumnsType<any> => [
    {
        title: t('STT'),
        dataIndex: 'rowIndex',
        key: 'rowIndex',
        align: 'center',
        width: 60,
        // sorter: (a, b) => a.rowIndex - b.rowIndex
    },
    {
        title: t('loyalty.service.category.name'),
        dataIndex: 'serviceName',
        key: 'serviceName',
        width: 300,
        // render: (text: string) => renderTruncate(text, 300),
        render: (text: string) => (
            <div style={{ whiteSpace: 'normal', wordBreak: 'break-word', textAlign: 'justify' }}>{text}</div>
        ),
        sorter: true,
        sortOrder: sortField === 'ServiceName' ? (sortType === 'ASC' ? 'ascend' : 'descend') : undefined,
    },
    {
        title: t('loyalty.service.order.memberValues'),
        dataIndex: 'memberValues',
        key: 'memberValues',
        width: 200,
        sorter: true,
        sortOrder: sortField === 'MemberValues' ? (sortType === 'ASC' ? 'ascend' : 'descend') : undefined,
        // render: (values: string[]) => (
        //     <>
        //         {values?.map((val) => {
        //             const opt = option.find((o) => o.value.toString() === val);
        //             return (
        //                 <Space key={val} size={[4, 4]} wrap>
        //                     <Tag key={val} color="blue">
        //                         {opt?.label || val}
        //                     </Tag>
        //                 </Space>
        //             );
        //         })}
        //     </>
        // ),
    },
    {
        title: t('loyalty.service.category.order.sort'),
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        width: 100,
        sorter: true,
        sortOrder: sortField === 'SortOrder' ? (sortType === 'ASC' ? 'ascend' : 'descend') : undefined,
    },
    {
        title: t('loyalty.service.category.status'),
        dataIndex: 'status',
        key: 'status',
        width: 140,

        // thêm filter
        filters: [
            { text: t('Active'), value: StatusEnum.Active },
            { text: t('Inactive'), value: StatusEnum.InActive },
        ],
        // rule filter cho table
        onFilter: (value, record) => record.status === value,
        // giữ nguyên phần sort
        render: (value: number) => <Tag color={statusColorMap[value] || 'default'}>{StatusEnum[value]}</Tag>,
    },
    {
        title: t('Action'),
        key: 'action',
        align: 'center',
        width: 180,
        render: (record) => (
            <div className="d-flex flex-center gap-3">
                <ButtonChange
                    permissionKey="/LoyaltyServiceCategory/Change"
                    buttonIcon={true}
                    onClick={() => onOpenAddOrChangeModal(record)}
                />

                <ButtonConfirm
                    keenIconName="cross-circle"
                    keenIconClassName="fs-2"
                    permissionKey="/LoyaltyServiceCategory/Remove"
                    clickFunc={() => onRemove(record.id)}
                    confirmTitle={t('are.you.sure.to.delete.loyalty.service.category')}
                    buttonClassType="btn-danger"
                    buttonIcon={true}
                />
            </div>
        ),
    },
];
