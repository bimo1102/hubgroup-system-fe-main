import { LocaleStringResourceEnum } from '../enums/locale-config.enum';
import { StatusEnum } from '../enums/common.enum';

export interface LocaleStringResourceConfigModel {
    id: string;
    domainName: string | null;
    fieldNamesJson: string | null;
    status: StatusEnum;
    type: LocaleStringResourceEnum;
}

export interface LocaleStringResourceConfigGetsRequest {
    keyword: string | null;
    pageIndex: number;
    pageSize: number;
    type: LocaleStringResourceEnum;
}

export interface LocaleStringResourceConfigGetByIdRequest {
    objectId: string;
}

export interface LocaleStringResourceConfigAddRequest {
    objectId: string | null;
    domainName: string | null;
    fieldNames: string[] | null;
    status: StatusEnum;
    type: LocaleStringResourceEnum;
}

export interface LocaleStringResourceConfigChangeRequest extends LocaleStringResourceConfigAddRequest {
}