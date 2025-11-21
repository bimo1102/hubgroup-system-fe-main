import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import {
    AutoCompleteRequest,
    BaseResponse,
    KeyValueTypeIntModel,
} from '@hubgroup-share-system-fe/types/common.type';

@Injectable({ providedIn: 'root' })
export class ProvinceService {
    constructor(private http: TytHttpClient) {}

    async provinceAutocomplete(
        request: AutoCompleteRequest
    ): Promise<BaseResponse<Array<KeyValueTypeIntModel>>> {
        return await this.http.post('/Location/ProvinceAutocomplete', request);
    }
    async autocomplete(request: any) {
        return await this.http.post('/Location/ProvinceAutocomplete', request);
    }
}
