import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import {
    EventAddRequest,
    EventAddToNewsRequest,
    EventArticleGetsRequest,
    EventChangeRequest,
    EventModel,
    EventRemoveFromNewsRequest,
    EventSearchRequest,
    EventStatusChangeRequest,
    EventSyncRequest,
} from '@hubgroup-share-system-fe/types/event.type';
import {
    BaseResponse,
    KeyValueTypeIntModel,
    KeyValueTypeStringModel,
    ObjectGetByIdRequest,
} from '@hubgroup-share-system-fe/types/common.type';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { NewsDisplayTypeEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import { NewsSimpleModel } from '@hubgroup-share-system-fe/types/news.type';

@Injectable({ providedIn: 'root' })
export class EventService {
    constructor(private http: TytHttpClient) {}

    gets(request: EventSearchRequest): Promise<
        BaseResponse<{
            models: Array<EventModel>;
            statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            totalRow: number;
        }>
    > {
        return this.http.post('/Event/Gets', request);
    }

    add(request: EventAddRequest): Promise<BaseResponse<null>> {
        return this.http.post('/Event/Add', request);
    }

    change(request: EventChangeRequest): Promise<BaseResponse<null>> {
        return this.http.post('/Event/Change', request);
    }

    changeStatus(request: EventStatusChangeRequest): Promise<BaseResponse<null>> {
        return this.http.post('/Event/ChangeStatus', request);
    }

    get(request: ObjectGetByIdRequest): Promise<{
        model: EventModel;
        isAdministrator: boolean;
        categoriesByZone: Array<KeyValueTypeStringModel>;
    }> {
        return this.http.post('/Event/Get', request);
    }

    autocomplete(
        request: EventSearchRequest
    ): Promise<BaseResponse<Array<KeyValueTypeStringModel>>> {
        return this.http.post('/event/Autocomplete', request);
    }

    eventAddToNews(request: EventAddToNewsRequest): Promise<BaseResponse<null>> {
        return this.http.post('/Event/EventAddToNews', request);
    }

    eventRemoveFromNews(request: EventRemoveFromNewsRequest): Promise<BaseResponse<null>> {
        return this.http.post('/Event/EventRemoveFromNews', request);
    }

    sync(request: EventSyncRequest) {
        return this.http.post('/Event/Sync', request);
    }

    articleGets(request: EventArticleGetsRequest): Promise<
        BaseResponse<{
            news: Array<NewsSimpleModel>;
            sources: Array<KeyValueTypeStringModel>;
            displayTypes: Array<KeyValueTypeIntModel<NewsDisplayTypeEnum>>;
            totalRow: number;
        }>
    > {
        return this.http.post('/Event/ArticleGets', request);
    }
}
