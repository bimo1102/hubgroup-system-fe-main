import { AuthenApplicationOptionEnum, AuthorizationApplicationEnum, StatusEnum } from '../enums/common.enum';

// models
export interface AuthenApplicationSecretModel {
    secret: string;
}

export interface AuthenApplicationModel {
    id: string | null;
    name: string | null;
    info: string | null;
    returnUrls: string[] | null;
    secret: string | null;
    status: StatusEnum;
    externalLoginConfigIds: string[] | null;
    extLogConfModels: ExtLogConfModel[] | null;
    options: AuthenApplicationOptionEnum[] | null;
    interval: number;
    checkUserExistUrl: string | null;
    isAutoRefreshToken: boolean;
    authorizationApplication : AuthorizationApplicationEnum ; 
}

export interface ExtLogConfModel { // from ExternalConfigModel
    id: string,
    status: StatusEnum,
    name: string,
    iconUrl: string,
    numericalOrder: number,
    option: number
}


// requests
export interface AuthenApplicationGetNewSecretRequest {
    id: string;
}

export interface AuthenApplicationDeleteRequest {
    id: string;
}

export interface AuthenApplicationGetByIdRequest {
    id: string;
}

export interface AuthenApplicationGetsRequest {
    keyword: string | null;
    status: StatusEnum;
    pageIndex: number;
    pageSize: number;
}

export interface AuthenApplicationAddOrChangeRequest {
    id: string | null;
    name: string | null;
    info: string | null;
    returnUrls: string[] | null;
    secret: string | null;
    status: StatusEnum;
    externalLoginConfigIds: string[] | null;
    options: AuthenApplicationOptionEnum[] | null;
    interval: number | null;
    checkUserExistUrl: string | null;
    isAutoRefreshToken: boolean;
    AuthorizationApplication : AuthorizationApplicationEnum;
}

