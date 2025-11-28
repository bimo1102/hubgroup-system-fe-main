import { Alert, Checkbox, Col, Form, Input, InputNumber, Row, Select, Spin } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ButtonClose from '@hubgroup-share-system-fe/react/components/common/buttons/button-close';
import ButtonSave from '@hubgroup-share-system-fe/react/components/common/buttons/button-save';
import LayoutBaseComponent from '@hubgroup-share-system-fe/react/components/layouts/layout-base-component';
import { useMasterLayout } from '@hubgroup-share-system-fe/react/components/layouts/master-layout';

import { useAppDispatch, useAppSelector } from '../../../../hooks/useAppStore';

type Props = React.HTMLAttributes<HTMLDivElement> & {};

const AddOrChangeloyaltyServiceCategory: React.FC<Props> = ({ modalRef }): React.ReactNode => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [form] = Form.useForm<any>();
    const initialValues: Partial<any> = { isGenSortOrder: true, status: true };
    const { onShowMessageSuccess, getMessageByResponse } = useMasterLayout();
    const { actionLoading } = useAppSelector((state) => state.common.process);
    const [messageString, setMessageString] = useState('');
    const [isGenSortOrder, setIsGenSortOrder] = useState(true);

    const onSave = async () => {
        onClose();
    };
    const onClose = () => {
        modalRef.destroy();
    };

    return (
        <Spin
            spinning={
                !!actionLoading.loyaltyServiceCategoryAdd ||
                !!actionLoading.loyaltyServiceCategoryChange ||
                !!actionLoading.loyaltyServiceCategoryDetail
            }>
            <div className="main-wrapper">
                <LayoutBaseComponent
                    header={{
                        title: modalRef?.data?.id ? t('editServiceCategory') : t('addNewServiceCategory'),
                        toolbar: (
                            <div className="d-flex gap-3">
                                <ButtonSave
                                    permissionKey={
                                        modalRef?.data?.id
                                            ? '/LoyaltyServiceCategory/Change'
                                            : '/LoyaltyServiceCategory/Insert'
                                    }
                                    onClick={onSave}
                                />
                                <ButtonClose onClick={onClose} />
                            </div>
                        ),
                    }}
                    body={
                        <>
                            {messageString && (
                                <div className="mb-2 message-error-wrapper">
                                    <Alert message={t(messageString)} type="error" showIcon />
                                </div>
                            )}
                            <Form
                                autoComplete="off"
                                labelCol={{ span: 24 }}
                                initialValues={initialValues}
                                form={form}
                                requiredMark={(label: React.ReactNode, { required }: { required: boolean }) => (
                                    <>
                                        {label}
                                        {required && <span className="text-danger ms-2">*</span>}
                                    </>
                                )}>
                                <Row gutter={20} wrap={true}>
                                    <Col span={24} md={24} xl={24} xxl={12}>
                                        <Form.Item
                                            name="serviceName"
                                            rules={[
                                                { required: true, message: t('serviceName.required') },
                                                { max: 255, message: t('serviceName.maxLength') },
                                            ]}
                                            label={
                                                <span className="text-gray-700 fw-bold text-break">
                                                    {t('loyalty.service.category.name')}
                                                </span>
                                            }>
                                            <Input placeholder={t('loyalty.service.input.category.name')} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} md={24} xl={24} xxl={12}>
                                        <Form.Item
                                            name="sortOrder"
                                            label={
                                                <span className="text-gray-700 fw-bold text-break">
                                                    {t('loyalty.service.order.sort')}
                                                </span>
                                            }>
                                            <InputNumber
                                                min={1}
                                                step={1}
                                                parser={(value) => {
                                                    const parsed = value?.replace(/\D/g, '');
                                                    return parsed ? Number(parsed) : 1;
                                                }}
                                                placeholder={t('loyalty.service.sort.order')}
                                                style={{ width: '100%' }}
                                                disabled={isGenSortOrder}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} md={24} xl={24} xxl={12}>
                                        <Form.Item
                                            name="memberValues"
                                            label={
                                                <span className="text-gray-700 fw-bold text-break">
                                                    {t('loyalty.service.order.memberValues')}
                                                </span>
                                            }
                                            rules={[{ required: true, message: t('memberValues.required') }]}>
                                            <Select
                                                allowClear
                                                showSearch
                                                mode="multiple"
                                                placeholder={t('loyalty.service.order.memberValues.type')}
                                                optionFilterProp="label"></Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} md={24} xl={24} xxl={12}>
                                        <Form.Item name="isGenSortOrder" valuePropName="checked">
                                            <Checkbox>{t('loyalty.service.category.isGenSortOrder')}</Checkbox>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item name="status" valuePropName="checked" style={{ margin: 0 }}>
                                    <Checkbox>{t('loyalty.service.category.status')}</Checkbox>
                                </Form.Item>
                            </Form>
                        </>
                    }
                />
            </div>
        </Spin>
    );
};

export default AddOrChangeloyaltyServiceCategory;
