import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import { UserAutocompleteRequest } from '@hubgroup-share-system-fe/types/user.type';
import { BaseResponse, KeyValueTypeStringModel } from '@hubgroup-share-system-fe/types/common.type';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: TytHttpClient) {}

    async autocompleteFull(
        request: UserAutocompleteRequest
    ): Promise<BaseResponse<Array<KeyValueTypeStringModel>>> {
        return await this.http.post('/User/AutocompleteFull', request);
    }
}
