import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import {
    AutoCompleteRequest,
    BaseResponse,
    KeyValueTypeIntModel,
    KeyValueTypeOptgroupModel,
    KeyValueTypeStringModel,
} from '@hubgroup-share-system-fe/types/common.type';
import { StatusEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { NewsDisplayTypeEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import {
    NewsTypeAddRequest,
    NewsTypeChangeStatusRequest,
    NewsTypeModel,
    NewsTypeSearchRequest,
    NewsTypeUpdateRequest,
} from '@hubgroup-share-system-fe/types/news-type.type';

@Injectable({ providedIn: 'root' })
export class NewsTypeService {
    constructor(private http: TytHttpClient) {}

    gets(request: NewsTypeSearchRequest): Promise<
        BaseResponse<{
            models: Array<NewsTypeModel>;
            statuses: Array<KeyValueTypeIntModel<StatusEnum>>;
            types: Array<KeyValueTypeIntModel<NewsDisplayTypeEnum>>;
            totalRow: number;
        }>
    > {
        return this.http.post('/NewsType/Gets', request);
    }

    getById(request: NewsTypeUpdateRequest): Promise<
        BaseResponse<{
            models: NewsTypeModel;
        }>
    > {
        return this.http.post('/NewsType/GetById', request);
    }

    insert(request: NewsTypeAddRequest): Promise<BaseResponse<null>> {
        return this.http.post('/NewsType/Insert', request);
    }

    update(request: NewsTypeUpdateRequest): Promise<BaseResponse<null>> {
        return this.http.post('/NewsType/Update', request);
    }

    changeStatus(request: NewsTypeChangeStatusRequest): Promise<BaseResponse<null>> {
        return this.http.post('/NewsType/ChangeStatus', request);
    }

    autocompleteParent(
        request: AutoCompleteRequest
    ): Promise<BaseResponse<Array<KeyValueTypeStringModel>>> {
        return this.http.post('/NewsType/AutocompleteParent', request);
    }

    autocompleteSource(
        request: AutoCompleteRequest
    ): Promise<BaseResponse<Array<KeyValueTypeOptgroupModel>>> {
        return this.http.post('/NewsType/AutocompleteSource', request);
    }
}
