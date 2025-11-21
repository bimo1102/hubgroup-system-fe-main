import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import { BaseResponse, KeyValueTypeIntModel } from '@hubgroup-share-system-fe/types/common.type';
import { NewsDisplayTypeEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import {
    IconConfigAvatarPositionEnum,
    IconConfigTypeEnum,
} from '@hubgroup-share-system-fe/enums/icon-config.enum';
import {
    IconConfigGetRequest,
    IconConfigGetsRequest,
    IconConfigInsertRequest,
    IconConfigModel,
    IconConfigUpdateRequest,
} from '@hubgroup-share-system-fe/types/icon-config.type';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';

@Injectable({ providedIn: 'root' })
export class IconConfigService {
    constructor(private http: TytHttpClient) {}

    gets(request: IconConfigGetsRequest): Promise<
        BaseResponse<{
            models: Array<IconConfigModel>;
            iconTypes: Array<KeyValueTypeIntModel<IconConfigTypeEnum>>;
            displayTypes: Array<KeyValueTypeIntModel<NewsDisplayTypeEnum>>;
            avatarPositions: Array<KeyValueTypeIntModel<IconConfigAvatarPositionEnum>>;
            totalRow: number;
        }>
    > {
        return this.http.post('/IconConfig/Gets', request);
    }

    get(request: IconConfigGetRequest): Promise<
        BaseResponse<{
            model: IconConfigModel;
            statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
        }>
    > {
        return this.http.post('/IconConfig/Get', request);
    }

    insert(request: IconConfigInsertRequest): Promise<BaseResponse<null>> {
        return this.http.post('/IconConfig/Insert', request);
    }

    update(request: IconConfigUpdateRequest): Promise<BaseResponse<null>> {
        return this.http.post('/IconConfig/Update', request);
    }
}
