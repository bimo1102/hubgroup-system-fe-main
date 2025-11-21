import { ComponentConditionTypeEnum, ComponentTypeEnum } from '../enums/component.enum';
import { NewsAdminSortFieldEnum, NewsAdminSortTypeEnum, StatusEnum } from '../enums/common.enum';
import { KeyValueTypeStringModel, SystemBaseReadModel } from './common.type';
import { PageDeviceTypeEnum } from '../enums/page.enum';

export interface ComponentGetsByTypeRequest {
    keyword: string;
    type: ComponentTypeEnum;
    groupId: string;
    pageIndex: number;
    pageSize: number;
}

export interface RComponent extends SystemBaseReadModel {
    name?: string;
    description?: string;
    status: StatusEnum;
    thumbnail?: string;
    type: ComponentTypeEnum;
    websiteId?: string;
    groupId?: string;
    jsObjectsJson?: string;
    cssObjectsJson?: string;
    conditionsJson?: string;
    totalPosition: number;
    sortType: NewsAdminSortTypeEnum;
    sortField: NewsAdminSortFieldEnum;
    isDefault: boolean;
    priority: number;
    htmlData?: string;
    htmlSourceData?: string;
    setting?: string;
    eMagazineVersion?: string;
    isPublish: boolean;
    versionPublish: number;
    parentId?: string;
    templateId?: string;
    jsObjects?: string[];
    cssObjects?: string[];
    conditions?: RComponentConditionObject[];
    content: string;
    hasContent: boolean;
    displaySettingsJson?: string;
    displaySettings?: RComponentDisplaySetting;
}

export interface RComponentDisplaySetting extends SystemBaseReadModel {
    displaySettings?: RComponentDisplaySettingByDevice[];
}

export interface RComponentConditionObject {
    key?: string;
    values?: string[];
    type: ComponentConditionTypeEnum;
}

export interface RComponentDisplaySettingByDevice {
    status: StatusEnum;
    startDate?: string;
    endDate?: string;
    config?: string;
    deviceType?: PageDeviceTypeEnum;
    html?: string;
}

export interface ComponentSearchRequest {
    keyword: string;
    types: ComponentTypeEnum[];
    groupIds: string[];
    pageIndex: number;
    pageSize: number;
    groupType?: any; // TemplateGroupTypeEnum;
    publish?: boolean;
    isPublishLastVersion?: boolean;
    isDefault?: boolean;
    eMagazineVersion?: string;
    templateIds?: string[];
    websiteIds?: string[];
}

export interface ComponentConditionModel {
    key: string;
    values?: string[];
    type: ComponentConditionTypeEnum;
    typeName: string;
    valueObjects: KeyValueTypeStringModel[];
}

export interface ComponentModel {
    id: string;
    name: string;
    description: string;
    status: boolean;
    thumbnail: string;
    type: ComponentTypeEnum;
    typeName: string;
    html?: string;
    htmlContent?: string;
    websiteId: string;
    groupId: string;
    jsObjects?: KeyValueTypeStringModel[];
    cssObjects?: KeyValueTypeStringModel[];
    conditions: ComponentConditionModel[];
    group: KeyValueTypeStringModel;
    website: KeyValueTypeStringModel;
    hasContent: boolean;
    isDefault: boolean;
    totalPosition: number;
    htmlSource?: string;
    sortType: NewsAdminSortTypeEnum;
    sortField: NewsAdminSortFieldEnum;
    priority: number;
    version: number;
    setting?: string;
    eMagazineVersion?: string;
    isPublish: boolean;
    versionPublish: number;
    templateId?: string;
    templateName?: string;
    displaySetting: any;
}

export interface ComponentAddRequest {
    name: string;
    description?: string;
    status: boolean;
    thumbnail: string;
    type?: ComponentTypeEnum;
    jsObjects?: KeyValueTypeStringModel[];
    cssObjects?: KeyValueTypeStringModel[];
    html?: string;
    websiteId: string;
    groupId?: string;
    conditions?: ComponentConditionAddRequest[];
    totalPosition: number;
    sortType?: NewsAdminSortTypeEnum;
    sortField?: NewsAdminSortFieldEnum;
    isDefault?: boolean;
    priority?: number;
    setting?: string;
    eMagazineVersion?: string;
    templateId?: string;
}

export interface ComponentConditionAddRequest {
    key: string;
    values: string[];
    type: ComponentConditionTypeEnum;
}

export interface ComponentChangeRequest extends ComponentAddRequest {
    id: string;
}

export interface ComponentGetByIdRequest {
    id: string;
}

export interface ComponentPublishRequest {
    id: string;
    version: number;
}

export interface ComponentUnPublishRequest extends ComponentPublishRequest {

}

export interface ComponentActionByWebsiteRequest {
    websiteId: string;
}

export interface ComponentConditionInitRequest {
    type: ComponentConditionTypeEnum;
}

export interface ComponentChangeStatusRequest {
    id: string,
    status: StatusEnum
}

export interface ComponentHtmlSourceChangeRequest {
    id: string;
    htmlSource?: string;
}

export interface ComponentConditionAutocompleteRequest {
    type: ComponentConditionTypeEnum;
    keyword?: string;
    websiteId?: string;
    pageIndex?: number;
}

