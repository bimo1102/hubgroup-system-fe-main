import React from 'react';
import { FederationAppInitProps } from './federation.type';

export type CommonBaseReducerState<T = unknown> = {
    models: Array<T>;
    model: T;
    metaData?: {
        pageIndex: number;
        pageSize: number;
        totalRow: number;
    };
};
export type CommonBaseListDetailReducerState<
    ListType = unknown,
    DetailType = unknown
> = {
    models: Array<ListType>;
    model?: DetailType;
    metaData?: {
        pageIndex: number;
        pageSize: number;
        totalRow: number;
    };
};
export type LoadingActionSliceState = {
    get: boolean;
    post: boolean;
    put: boolean;
    delete: boolean;
};

export type CommonReducerState = {
    process: {
        listLoading: boolean;
        actionLoading: Partial<LoadingActionSliceState>;
    };
    error: {
        messages: Array<string>;
        statusCode: number;
    };
    federationResolver: FederationAppInitProps;
    onShowDialogModalLarge: (params: CommonModalPropsConfiguration) => void;
    onShowDialogModalMedium: (params: CommonModalPropsConfiguration) => void;
    onShowDialogModalSmall: (params: CommonModalPropsConfiguration) => void;
    moduleConfig?: {
        moduleName: string;
        prefixClass: string;
        appVersion: string;
    };
};

export type CommonModalPropsConfiguration = {
    title?: React.ReactNode;
    component: React.ElementType<React.ReactElement, any>;
    afterClose?: () => void;
    closable?: boolean;
    data?: any;
    dataUi?: any;
    width?: number | string;
};
