import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import { BaseResponse, KeyValueTypeStringModel } from '@hubgroup-share-system-fe/types/common.type';
import {
    WebsiteGetByIdRequest,
    WebsiteGetsRequest,
    WebsiteInfoModel,
} from '@hubgroup-share-system-fe/types/website.type';

@Injectable({ providedIn: 'root' })
export class DealerService {
    constructor(private http: TytHttpClient) {}

    async get(request: WebsiteGetByIdRequest): Promise<BaseResponse<WebsiteInfoModel>> {
        return await this.http.post('/Website/Get', request);
    }

    async autocomplete(
        request: WebsiteGetsRequest
    ): Promise<BaseResponse<Array<KeyValueTypeStringModel>>> {
        return await this.http.post('/Website/Autocomplete', request);
    }
}
