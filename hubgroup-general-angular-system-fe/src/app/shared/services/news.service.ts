import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import {
    BaseResponse,
    KeyValueTypeIntModel,
    KeyValueTypeStringModel,
    ObjectGetByIdRequest,
} from '@hubgroup-share-system-fe/types/common.type';
import {
    DisplayTypeChangeRequest,
    NewsCheckDuplicateRequest,
    NewsCheckUrlRequest,
    NewsSearchRequest,
    NewsSimpleModel,
    NewsSyncToESRequest,
    SeoScopeRequest,
} from '@hubgroup-share-system-fe/types/news.type';
import { NewsStatusEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import { SeoPointModel } from '@hubgroup-share-system-fe/types/seo.type';
import StatusResponseEnum from '@hubgroup-share-system-fe/enums/status-response.enum';

@Injectable({ providedIn: 'root' })
export class NewsService {
    constructor(private http: TytHttpClient) {}

    async syncToES(request: NewsSyncToESRequest): Promise<BaseResponse<null>> {
        return await this.http.post('/News/SyncToES', request);
    }

    async getsRelatedNews(request: NewsSearchRequest): Promise<
        BaseResponse<{
            news: Array<NewsSimpleModel>;
            icons: Array<KeyValueTypeStringModel>;
            sources: Array<KeyValueTypeStringModel>;
            displayTypes: Array<KeyValueTypeStringModel>;
            statuses: Array<KeyValueTypeIntModel<NewsStatusEnum>>;
            totalRow: number;
        }>
    > {
        return await this.http.post('/News/GetsRelatedNews', request);
    }

    async getDuplicates(request: NewsCheckDuplicateRequest): Promise<
        BaseResponse<{
            news: Array<NewsSimpleModel>;
            totalRow: number;
        }>
    > {
        return await this.http.post('/News/GetDuplicates', request);
    }

    async getAutocomplete(request: any) {
        return await this.http.post('/News/Autocomplete', request);
    }

    async preview(request: ObjectGetByIdRequest): Promise<
        BaseResponse<{
            previewUrl: string;
            publishedUrl: string;
        }>
    > {
        return await this.http.post('/News/Preview', request);
    }

    async getPreviewUrl(request: any) {
        return this.http.post('/News/Preview', request);
    }

    async seoScope(request: SeoScopeRequest): Promise<BaseResponse<SeoPointModel>> {
        return await this.http.post('/News/SeoScope', request);
    }

    async displayTypeChange(request: DisplayTypeChangeRequest): Promise<BaseResponse<string>> {
        return await this.http.post('/News/DisplayTypeChange', request);
    }

    async checkUrl(request: NewsCheckUrlRequest): Promise<
        BaseResponse<{
            status: StatusResponseEnum;
        }>
    > {
        return await this.http.post('/News/CheckUrl', request);
    }
    async gets(request: any) {
        return await this.http.post('/News/Gets', request);
    }
}
