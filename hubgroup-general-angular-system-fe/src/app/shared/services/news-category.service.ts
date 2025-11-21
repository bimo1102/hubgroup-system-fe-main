import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import {
    BaseResponse,
    KeyValueTypeStringModel,
    ObjectGetByIdRequest,
} from '@hubgroup-share-system-fe/types/common.type';
import {
    NewsCategoryAddRequest,
    NewsCategoryAutocompleteRequest,
    NewsCategoryChangeRequest,
    NewsCategoryChangeSeoRequest,
    NewsCategoryListModel,
    NewsCategoryModel,
    NewsCategorySeoModel,
    NewsCategoryStatusChangeRequest,
} from '@hubgroup-share-system-fe/types/news-category.type';

@Injectable({ providedIn: 'root' })
export class NewsCategoryService {
    constructor(private http: TytHttpClient) {}

    gets(): Promise<BaseResponse<NewsCategoryListModel>> {
        return this.http.post('/NewsCategory/Gets', {});
    }

    getsAllParent() {
        return this.http.post('/NewsCategory/GetsAllParents', {});
    }

    getById(request: ObjectGetByIdRequest): Promise<
        BaseResponse<{
            model: NewsCategoryModel;
            parent: KeyValueTypeStringModel;
        }>
    > {
        return this.http.post('/NewsCategory/GetById', request);
    }

    autocompleteAllTree(
        request: NewsCategoryAutocompleteRequest
    ): Promise<BaseResponse<Array<KeyValueTypeStringModel>>> {
        return this.http.post('/NewsCategory/AutocompleteAllTree', request);
    }

    autocomplete(request: any) {
        return this.http.post('/NewsCategory/AutocompleteAllTree', request);
    }

    autocompleteAllTreeByWebsite(
        request: NewsCategoryAutocompleteRequest
    ): Promise<BaseResponse<Array<KeyValueTypeStringModel>>> {
        return this.http.post('/NewsCategory/AutocompleteAllTreeByWebsite', request);
    }

    getSeoById(request: ObjectGetByIdRequest): Promise<
        BaseResponse<{
            model: NewsCategorySeoModel;
        }>
    > {
        return this.http.post('/NewsCategory/GetSeoById', request);
    }

    add(request: NewsCategoryAddRequest): Promise<BaseResponse<null>> {
        return this.http.post('/NewsCategory/Add', request);
    }

    change(request: NewsCategoryChangeRequest): Promise<BaseResponse<null>> {
        return this.http.post('/NewsCategory/Change', request);
    }

    changeSeo(request: NewsCategoryChangeSeoRequest) {
        return this.http.post('/NewsCategory/ChangeSeo', request);
    }

    Select(request: any) {
        return this.http.post('/NewsCategory/Select', request);
    }

    statusChange(request: NewsCategoryStatusChangeRequest): Promise<BaseResponse<null>> {
        return this.http.post('/NewsCategory/StatusChange', request);
    }

    wikiCategoryMappingAdd(request: any) {
        return this.http.post('/NewsCategory/WikiCategoryMappingAdd', request);
    }

    addZoneByCategory(request: any) {
        return this.http.post('/NewsCategory/AddZoneByCategory', request);
    }
}
