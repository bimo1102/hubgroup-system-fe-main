import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';
import { MenuModel } from '@hubgroup-share-system-fe/types/menu.type';
import { MenuPosition } from '@hubgroup-share-system-fe/enums/menu.enum';

@Injectable({ providedIn: 'root' })
export class MenuService {
    constructor(private httpClient: TytHttpClient) {}

    async display(): Promise<
        BaseResponse<{
            menus: Array<MenuModel>;
            menusByUser: Array<MenuModel>;
        }>
    > {
        return await this.httpClient.get('/Menu/Display');
    }

    async getByPositionMenus(menuPosition: MenuPosition): Promise<
        BaseResponse<{
            menus: Array<MenuModel>;
        }>
    > {
        return await this.httpClient.get('/Menu/GetByPositionMenus?position=' + menuPosition);
    }
}
