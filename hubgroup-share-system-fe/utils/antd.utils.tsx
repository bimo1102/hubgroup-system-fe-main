import React from 'react';
import { InputNumberProps } from 'antd';
import type { TFunction } from 'i18next';
import i18n from "./../react/providers/i18n/i18nConfiguration";

export const pageSizeOptions = ['10', '25', '50', '100'];
export const onShowTotalConfig = (total: number, range: [number, number]) => (
    <div className='me-5'>
        {range[0]} {i18n.t('to')} {range[1]} {i18n.t('ofTotalItems')} {total}
    </div>
);

export const requiredMark = (label: React.ReactNode, { required }: { required: boolean }) => {
    return (
        <React.Fragment>
            {label}
            {required && <span className='text-danger ms-2'>*</span>}
        </React.Fragment>
    )
}

export const vndMoneyFormatter: InputNumberProps<number>['formatter'] = (value) => {
    const [start, end] = `${value}`.split('.') || [];
    const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${end ? `${v}.${end}` : `${v}`}`;
};

export function vndFormatter(price: any): string {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}