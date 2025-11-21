import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TytHttpClient } from '../../../shared/tyt-http-client.service';
import { CommonService } from '../../../shared/common.service';
import { Common } from '../../../shared/common';
import { environment } from '../../../../environments/environment';
import { AuthReloadEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import StatusResponseEnum from '@hubgroup-share-system-fe/enums/status-response.enum';
import {
    AngularAuthService,
    AngularEnvironmentService,
    AngularSharedService,
} from 'nexussoft-angular-shared';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private tytHttpClient: TytHttpClient,
        private router: Router,
        protected commonService: CommonService,
        private angularEnvironmentService: AngularEnvironmentService,
        private angularSharedService: AngularSharedService,
        private angularAuthService: AngularAuthService
    ) {
        this.setConfig();
        this.angularAuthService.currentUser$.subscribe((user) => {
            if (user?.dealerId) {
                this.setConfig();
            }
        });
    }

    setConfig(dealerId: string = '') {
        const configWebsite =
            environment.multiple.find((item) => item.websites.includes(dealerId)) ||
            environment.multiple[0] ||
            {};
        this.angularEnvironmentService.environment = {
            ...configWebsite,
            clientWebsiteId: dealerId,
        };
    }

    async logout() {
        this.removeTokenToLocalStorage();
        await this.tytHttpClient.postWithCredentials(environment.ssoUrl + '/Login/DoLogout', {});
        await this.router.navigate(['/auth/login']);
    }

    async getUserByToken(isReload = false) {
        const response: BaseResponse<{
            id: string;
            email: string;
            phoneNumber: string;
            fullName: string;
        }> = await this.tytHttpClient.get(environment.ssoUrl + '/Account/UserInfo');
        if (response.status && response.data) {
            this.angularAuthService.currentUserValue = {
                ...response.data,
                isAdministrator: true,
            };

            // @ts-ignore
            this.angularSharedService.currentResponseStatus = StatusResponseEnum.OK;
        } else {
            this.angularAuthService.currentUserValue = null;
        }

        if (isReload) {
            this.commonService.currentReloadValue = AuthReloadEnum.ReloadLoginProcess;
        }
    }

    private setTokenToLocalStorage(token: string): boolean {
        localStorage.setItem(Common.AuthLocalStorageToken, token);
        return true;
    }

    private removeTokenToLocalStorage(): boolean {
        localStorage.removeItem(Common.AuthLocalStorageToken);
        return true;
    }
}
