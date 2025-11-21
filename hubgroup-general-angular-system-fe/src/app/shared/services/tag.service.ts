import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import {
    AutoCompleteRequest,
    BaseResponse,
    KeyValueTypeStringModel,
} from '@hubgroup-share-system-fe/types/common.type';
import {
    MultiTagsStatusChangeRequest,
    TagConvertRequest,
    TagModel,
    TagsAddNewsRequest,
    TagsAddRequest,
    TagsChangeRequest,
    TagsDeleteByIdsRequest,
    TagsGetByIdRequest,
    TagsOptionChangeRequest,
    TagsRemoveFromNewsRequest,
    TagsSearchRequest,
    TagsStatusChangeRequest,
} from '@hubgroup-share-system-fe/types/tag.type';

@Injectable({ providedIn: 'root' })
export class TagService {
    constructor(private http: TytHttpClient) {}

    gets(request: TagsSearchRequest): Promise<
        BaseResponse<{
            totalRow: number;
            models: Array<TagModel>;
        }>
    > {
        return this.http.post('/Tags/Gets', request);
    }

    getById(request: TagsGetByIdRequest): Promise<
        BaseResponse<{
            model: TagModel;
        }>
    > {
        return this.http.post('/Tags/GetById', request);
    }

    add(request: TagsAddRequest) {
        return this.http.post('/Tags/Add', request);
    }

    change(request: TagsChangeRequest) {
        return this.http.post('/Tags/Change', request);
    }

    statusChange(request: TagsStatusChangeRequest) {
        return this.http.post('/Tags/StatusChange', request);
    }

    optionsChange(request: TagsOptionChangeRequest) {
        return this.http.post('/Tags/OptionsChange', request);
    }

    delete(request: TagsDeleteByIdsRequest) {
        return this.http.post('/Tags/Delete', request);
    }

    multiStatusChange(request: MultiTagsStatusChangeRequest) {
        return this.http.post('/Tags/MultiStatusChange', request);
    }

    addNewsToTag(request: TagsAddNewsRequest) {
        return this.http.post('/Tags/AddNewsToTag', request);
    }

    removeTagFromNews(request: TagsRemoveFromNewsRequest) {
        return this.http.post('/Tags/RemoveTagFromNews', request);
    }

    syncAll() {
        return this.http.post('/Tags/SyncAll', {});
    }

    tagConvert(request: TagConvertRequest) {
        return this.http.post('/Tags/TagConvert', request);
    }

    autocomplete(
        request: AutoCompleteRequest
    ): Promise<BaseResponse<Array<KeyValueTypeStringModel>>> {
        return this.http.post('/Tags/Autocomplete', request);
    }
}
