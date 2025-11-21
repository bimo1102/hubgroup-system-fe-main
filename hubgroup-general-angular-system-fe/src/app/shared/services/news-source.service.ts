import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import {
    SourceGetRequest,
    SourcesInsertRequest,
    SourcesModel,
    SourcesSearchRequest,
    SourcesUpdateRequest,
} from '@hubgroup-share-system-fe/types/sources.type';
import {
    BaseResponse,
    KeyValueTypeIntModel,
    KeyValueTypeStringModel,
    SourceSettingEnum,
} from '@hubgroup-share-system-fe/types/common.type';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';

@Injectable({
    providedIn: 'root',
})
export class SourcesService {
    constructor(private http: TytHttpClient) {}

    gets(request: SourcesSearchRequest): Promise<
        BaseResponse<{
            models: Array<SourcesModel>;
            totalRow: number;
        }>
    > {
        return this.http.post('/Sources/Gets', request);
    }

    getById(request: SourceGetRequest): Promise<
        BaseResponse<{
            model: SourcesModel;
            settingTypes: Array<KeyValueTypeIntModel<SourceSettingEnum>>;
            statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
        }>
    > {
        return this.http.post('/Sources/Get', request);
    }

    insert(request: SourcesInsertRequest): Promise<BaseResponse<null>> {
        return this.http.post('/Sources/Insert', request);
    }

    update(request: SourcesUpdateRequest): Promise<BaseResponse<null>> {
        return this.http.post('/Sources/Update', request);
    }

    async autocomplete(
        request: SourcesSearchRequest
    ): Promise<BaseResponse<Array<KeyValueTypeStringModel>>> {
        return await this.http.post('/Sources/Autocomplete', request);
    }
}
