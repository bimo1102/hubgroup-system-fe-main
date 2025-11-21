import { StatusEnum } from '../enums/common.enum';

export interface WebHookModel {
    id: string;
    userId: string;
    username: string;
    scopes : string[];
    token : string
    createdDate: Date;
    updatedDate: Date;
    createdBy: string;
    status : StatusEnum;
    expireDate : Date;
    appName : string;
    scopesList : string[];
    expireMinute : number;
}

export class WebHookAddRequest {
    userId : string;
    scopes: string[];
    expMinute : number;
    appName : string;
    type: number;
}

export class WebHookSearchRequest {
    username : string;
    pageSize :  number;
    pageIndex : number;
}

export class WebHookUpdateRequest {
    appName : string;
    scopes : string[];
    id : string;
}