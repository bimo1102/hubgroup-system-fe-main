import { Alert, Col, Form, Input, Row, Space, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PAGE_INDEX, PAGE_SIZE } from '@hubgroup-share-system-fe/constant/common.constant';
import ButtonAdd from '@hubgroup-share-system-fe/react/components/common/buttons/button-add';
import LayoutBaseComponent from '@hubgroup-share-system-fe/react/components/layouts/layout-base-component';
import { useMasterLayout } from '@hubgroup-share-system-fe/react/components/layouts/master-layout';

import { useAppDispatch, useAppSelector } from '@hooks/useAppStore';

import ButtonSearch from '@hubgroup-share-system-fe/react/components/common/buttons/button-search';
import { Option } from '@hubgroup-share-system-fe/types/common.type';
import { onShowTotalConfig, pageSizeOptions } from '@hubgroup-share-system-fe/utils/antd.utils';
import { SorterResult } from 'antd/es/table/interface';
import { getloyaltyServiceCategoryColumns } from '../components/columns/loyalty-service-category';
import AddOrChangeloyaltyServiceCategory from '../components/modal/add-or-change-loyalty-service-category';
import myReducer, { decrement, increment } from '@shareds/providers/redux/reducers/test.reducer';
import { injectReducer } from 'GeneralApplication/store';
type Props = {};
interface DataType {
    key: React.ReactNode;
}

const ServiceCategoryList: React.FC<Props> = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [form] = Form.useForm<any>();
    const { getMessageByResponse, onShowMessageSuccess } = useMasterLayout();
    const { onShowDialogModalSmall } = useAppSelector((state) => state.common);
    const value = useAppSelector((state) => state?.myRemote?.value) ?? 0;
    const a = useAppSelector((state) => state);
    console.log(a);
    console.log(value);
    const { actionLoading } = useAppSelector((state) => state.common.process);
    const federationResolver = useAppSelector((state) => state.common.federationResolver);
    const [option, setOption] = useState<Option[]>([]);
    const [messageString, setMessageString] = useState('');
    const [data, setData] = useState<any>([]);
    const [request, setRequest] = useState<any>({
        keyword: '',
        pageIndex: PAGE_INDEX,
        pageSize: PAGE_SIZE,
    });
    const [isRequestChange, setIsRequestChange] = useState<boolean>(false);
    useEffect(() => {
        const sampleData = [
            {
                id: '1',
                rowIndex: 1,
                serviceName: 'Gold Customer Service',
                memberValues: ['VIP', 'Gold'],
                sortOrder: 1,
                status: 1,
            },
            {
                id: '2',
                rowIndex: 2,
                serviceName: 'Silver Customer Service',
                memberValues: ['Silver'],
                sortOrder: 2,
                status: 3,
            },
            {
                id: '3',
                rowIndex: 3,
                serviceName: 'Basic Customer Service',
                memberValues: ['Basic'],
                sortOrder: 3,
                status: 1,
            },
            // Fake thêm 7 thằng
            {
                id: '4',
                rowIndex: 4,
                serviceName: 'Premium Cleaning Service',
                memberValues: ['VIP'],
                sortOrder: 4,
                status: 1,
            },
            {
                id: '5',
                rowIndex: 5,
                serviceName: 'Express Delivery Service',
                memberValues: ['Gold', 'VIP'],
                sortOrder: 5,
                status: 3,
            },
            {
                id: '6',
                rowIndex: 6,
                serviceName: 'Home Support Service',
                memberValues: ['Silver'],
                sortOrder: 6,
                status: 1,
            },
            {
                id: '7',
                rowIndex: 7,
                serviceName: 'Customer Care Plus',
                memberValues: ['Gold'],
                sortOrder: 7,
                status: 3,
            },
            {
                id: '8',
                rowIndex: 8,
                serviceName: 'Technical Support Service',
                memberValues: ['VIP', 'Basic'],
                sortOrder: 8,
                status: 1,
            },
            {
                id: '9',
                rowIndex: 9,
                serviceName: 'Maintenance Inspection Service',
                memberValues: ['Basic'],
                sortOrder: 9,
                status: 3,
            },
            {
                id: '10',
                rowIndex: 10,
                serviceName: 'Loyalty Reward Service',
                memberValues: ['VIP', 'Gold', 'Silver'],
                sortOrder: 10,
                status: 1,
            },
        ];

        setData(sampleData);
    }, []);

    useEffect(() => {
        injectReducer('myRemote', myReducer);
    }, []);

    useEffect(() => {
        setIsRequestChange(true);
    }, [request.keyword]);

    useEffect(() => {
        if (federationResolver.queryParams) {
            const { keyword, pageIndex, pageSize, sortField, sortType } = federationResolver.queryParams;

            setRequest((prev: any) => ({
                ...prev,
                keyword: keyword ?? prev.keyword,
                pageIndex: pageIndex ? Number(pageIndex) : prev.pageIndex,
                pageSize: pageSize ? Number(pageSize) : prev.pageSize,
                sortField: sortField ?? prev.sortField,
                sortType: sortType ?? prev.sortType,
            }));
            form.setFieldValue('keyword', keyword ? String(keyword) : '');
            if (keyword && keyword.trim() !== '') {
                // (async () => await onSearch())();
            }
        }
    }, [federationResolver.queryParams]);
    useEffect(() => {}, [request.pageIndex, request.pageSize, request.sortField, request.sortType]);

    const onOpenImportSparePart = (data?: any) => {};
    const onOpenAddOrChangeModal = (data?: any) => {
        onShowDialogModalSmall({
            component: AddOrChangeloyaltyServiceCategory,
            data: data,
            afterClose: () => {
                // onSearch();
            },
            closable: false,
        });
    };

    const onPageIndexChange = (pageIndex: number, pageSize?: number) => {
        setRequest((prev: any) => {
            const isPageSizeChanged = pageSize && pageSize !== prev.pageSize;
            return {
                ...prev,
                pageIndex: isPageSizeChanged ? 0 : pageIndex - 1,
                pageSize: pageSize ?? prev.pageSize,
            };
        });
    };
    const pagination = {
        pageSize: request.pageSize,
        current: request.pageIndex + 1,
        // total: totalRow,
        onChange: onPageIndexChange,
        showTotal: onShowTotalConfig,
        pageSizeOptions: pageSizeOptions,
        showSizeChanger: true,
    };

    const onRow = (record: any) => ({
        onDoubleClick: () => onOpenAddOrChangeModal(record),
    });

    const handleTableChange = (pagination: any, filters: any, sorter: SorterResult<any>, extra: any) => {
        if (extra.action === 'paginate') return;
        if (!sorter?.order || !sorter?.field) {
            setRequest((prev: any) => ({
                ...prev,
                sortField: undefined,
                sortType: undefined,
            }));
            return;
        }
    };

    return (
        <Spin spinning={false}>
            <div className="main-wrapper">
                <LayoutBaseComponent
                    header={{
                        title: t('loyalty.service.category.List'),
                        toolbar: (
                            <Space>
                                <ButtonAdd
                                    permissionKey="/LoyaltyServiceCategory/GetById"
                                    onClick={() => onOpenAddOrChangeModal()}
                                    text="addNewServiceCategory"
                                />
                                <ButtonAdd onClick={() => dispatch(increment())} text="plus" />
                                <ButtonAdd onClick={() => dispatch(decrement())} text="minus" keenIconName="minus" />
                            </Space>
                        ),
                    }}
                    body={
                        <>
                            {messageString && (
                                <div className="mb-2 message-error-wrapper">
                                    <Alert message={messageString} type="error" showIcon />
                                </div>
                            )}
                            <Form
                                form={form}
                                autoComplete="off"
                                onFinish={() =>
                                    // request.pageIndex > 0 && isRequestChange ? onPageIndexChange(1) : onSearch()
                                    {}
                                }>
                                <Row gutter={20} wrap>
                                    <Col span={24} md={12} xl={8} xxl={7}>
                                        <Form.Item>
                                            <Space.Compact>
                                                <Input style={{ width: 100 }} value={t('Keyword')} disabled />
                                                <Input
                                                    placeholder={t('loyaltyServiceCategory.inputKeyword')}
                                                    value={request.keyword}
                                                    onChange={(e) =>
                                                        setRequest((prev: any) => ({
                                                            ...prev,
                                                            keyword: e.target.value,
                                                        }))
                                                    }
                                                />
                                            </Space.Compact>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} md={12} xl={8} xxl={3}>
                                        <ButtonSearch permissionKey="/LoyaltyServiceCategory/Gets" type="submit" />
                                    </Col>
                                </Row>
                            </Form>
                            <Table
                                className="mt-2"
                                size="small"
                                bordered
                                columns={getloyaltyServiceCategoryColumns(
                                    t,
                                    onOpenAddOrChangeModal,
                                    // onRemove,
                                    onOpenImportSparePart,
                                    request.sortField,
                                    request.sortType
                                )}
                                dataSource={data}
                                pagination={pagination}
                                scroll={{ x: 'max-content' }}
                                rowKey="id"
                                onRow={onRow}
                                locale={{
                                    cancelSort: t('cancelSort'),
                                    triggerAsc: t('triggerAsc'),
                                    triggerDesc: t('triggerDesc'),
                                }}
                                onChange={handleTableChange}
                            />
                        </>
                    }
                />
            </div>
        </Spin>
    );
};

export default ServiceCategoryList;
