import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import {
    BaseResponse,
    KeyValueTypeIntModel,
    KeyValueTypeLongModel,
    KeyValueTypeStringModel,
} from '@hubgroup-share-system-fe/types/common.type';
import {
    NewsDisplayTypeEnum,
    NewsOptionEnum,
    NewsStatusEnum,
} from '@hubgroup-share-system-fe/enums/news.enum';
import {
    NewsGroupConditionModel,
    NewsOnlineAddRequest,
    NewsOnlineChangeRequest,
    NewsOnlineGetsRequest,
    NewsOnlineInitAddOrChangeRequest,
    NewsOnlineSimpleModel,
    NewsOnlineStatusChangeRequest,
} from '@hubgroup-share-system-fe/types/news-online.type';
import { InitAddOrChangeResponseType } from '@hubgroup-share-system-fe/types/news-online-client.type';
import {
    NewsSearchRequest,
    NewsSimpleModel,
    NewsSyncToESRequest,
} from '@hubgroup-share-system-fe/types/news.type';

@Injectable({ providedIn: 'root' })
export class NewsOnlineService {
    constructor(private http: TytHttpClient) {}

    async gets(request: NewsOnlineGetsRequest): Promise<
        BaseResponse<{
            news: Array<NewsOnlineSimpleModel>;
            statuses: Array<KeyValueTypeIntModel<NewsStatusEnum>>;
            displayTypes: Array<KeyValueTypeIntModel<NewsDisplayTypeEnum>>;
            totalRow: number;
            keyword: string;
            pageSize: Number;
            tabs: Array<NewsGroupConditionModel>;

            fieldSums: Array<{ group: string; total: number }>;
            icons: Array<KeyValueTypeStringModel>;
            sources: Array<KeyValueTypeStringModel>;
            options: Array<KeyValueTypeLongModel<NewsOptionEnum>>;

            tagsFilter: Array<KeyValueTypeStringModel>;
            authorsFilter: Array<KeyValueTypeStringModel>;
            seriesFilter: Array<KeyValueTypeStringModel>;
            eventsFilter: Array<KeyValueTypeStringModel>;
            categoryMainsFilter: Array<KeyValueTypeStringModel>;
            categorySubsFilter: Array<KeyValueTypeStringModel>;
            createdUsersFilter: Array<KeyValueTypeStringModel>;
            provincesFilter: Array<KeyValueTypeIntModel>;
            userNeedsFilter: Array<KeyValueTypeIntModel>;
            agenciesFilter: Array<KeyValueTypeStringModel>;
            parentWebsiteFilter: KeyValueTypeStringModel;
        }>
    > {
        return await this.http.post('/NewsOnline/Gets', request);
    }

    async syncToES(request: NewsSyncToESRequest): Promise<BaseResponse<null>> {
        return await this.http.post('/NewsOnline/SyncToES', request);
    }

    // region normal
    async normalInitAddOrChange(
        request: NewsOnlineInitAddOrChangeRequest
    ): Promise<BaseResponse<InitAddOrChangeResponseType>> {
        return await this.http.post('/NewsOnlineAddOrChange/NormalInitAddOrChange', request);
    }

    async normalAdd(request: NewsOnlineAddRequest): Promise<BaseResponse<null>> {
        return await this.http.post('/NewsOnlineAddOrChange/NormalAdd', request);
    }

    async normalChange(request: NewsOnlineChangeRequest): Promise<BaseResponse<null>> {
        return await this.http.post('/NewsOnlineAddOrChange/NormalChange', request);
    }

    async normalStatusChange(request: NewsOnlineStatusChangeRequest): Promise<BaseResponse<null>> {
        return await this.http.post('/NewsOnlineAddOrChange/NormalStatusChange', request);
    }

    // endregion
}
