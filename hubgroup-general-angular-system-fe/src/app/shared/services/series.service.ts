import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import {
    SeriesAddRequest,
    SeriesAddToNewsRequest,
    SeriesArticleGetsRequest,
    SeriesChangeRequest,
    SeriesModel,
    SeriesRemoveFromNewsRequest,
    SeriesSearchRequest,
    SeriesStatusChangeRequest,
    SeriesSyncRequest,
} from '@hubgroup-share-system-fe/types/series.type';
import {
    BaseResponse,
    KeyValueTypeIntModel,
    KeyValueTypeStringModel,
    ObjectGetByIdRequest,
} from '@hubgroup-share-system-fe/types/common.type';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';

@Injectable({ providedIn: 'root' })
export class SeriesService {
    constructor(private http: TytHttpClient) {}

    gets(request: SeriesSearchRequest): Promise<{
        series: Array<SeriesModel>;
        statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
        totalRow: number;
    }> {
        return this.http.post('/Series/Gets', request);
    }

    add(request: SeriesAddRequest): Promise<BaseResponse<null>> {
        return this.http.post('/Series/Add', request);
    }

    change(request: SeriesChangeRequest): Promise<BaseResponse<null>> {
        return this.http.post('/Series/Change', request);
    }

    changeStatus(request: SeriesStatusChangeRequest): Promise<BaseResponse<null>> {
        return this.http.post('/Series/ChangeStatus', request);
    }

    get(request: ObjectGetByIdRequest): Promise<
        BaseResponse<{
            model: SeriesModel;
            categoriesByZone: Array<KeyValueTypeStringModel>;
        }>
    > {
        return this.http.post('/Series/Get', request);
    }

    autocomplete(
        request: SeriesSearchRequest
    ): Promise<BaseResponse<Array<KeyValueTypeStringModel>>> {
        return this.http.post('/Series/Autocomplete', request);
    }

    seriesAddToNews(request: SeriesAddToNewsRequest) {
        return this.http.post('/Series/SeriesAddToNews', request);
    }

    seriesRemoveFromNews(request: SeriesRemoveFromNewsRequest) {
        return this.http.post('/Series/SeriesRemoveFromNews', request);
    }

    articleGets(request: SeriesArticleGetsRequest) {
        return this.http.post('/Series/ArticleGets', request);
    }

    autocompleteByWebsite(
        request: SeriesSearchRequest
    ): Promise<BaseResponse<Array<KeyValueTypeStringModel>>> {
        return this.http.post('/Series/AutocompleteByWebsite', request);
    }

    sync(request: SeriesSyncRequest) {
        return this.http.post('/Series/Sync', request);
    }
}
