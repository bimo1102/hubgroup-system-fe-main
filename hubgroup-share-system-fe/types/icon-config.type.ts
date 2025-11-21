import {NewsDisplayTypeEnum} from "../enums/news.enum";
import {IconConfigAvatarPositionEnum, IconConfigTypeEnum} from "../enums/icon-config.enum";

export interface IconConfigModel {
    id: string;
    title: string;
    url: string;
    createdDate: string;
    createdUid: string;
    status: number;
    dealerId?: string;
    type: IconConfigTypeEnum;
    avatarPosition: IconConfigAvatarPositionEnum;
    setting?: IconConfigSettingModel;
}

export interface IconConfigSettingModel {
    defaultNewsDisplayTypes?: NewsDisplayTypeEnum[];
}

export interface IconConfigGetsRequest {
    title: string;
    type: IconConfigTypeEnum;
}

export interface IconConfigInsertRequest {
    title: string;
    url: string;
    status: number;
    type: IconConfigTypeEnum;
    avatarPosition: IconConfigAvatarPositionEnum;
    setting?: RIconConfigSetting;
}

export interface IconConfigUpdateRequest extends IconConfigInsertRequest {
    id: string;
}

export interface IconConfigGetRequest {
    id: string;
}

export interface RIconConfigSetting {
    defaultNewsDisplayTypes?: NewsDisplayTypeEnum[];
}