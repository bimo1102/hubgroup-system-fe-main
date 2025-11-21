import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import { environment } from '../../../environments/environment';
import {
    CompanySelectedRequest,
    LoginActivityNotifyRequest,
    OtpVerifyRequest,
    QRGenerateRequest,
    QRGenerateResponse,
    WebsiteSelectedRequest,
} from '@hubgroup-share-system-fe/types/authentication.type';
import { BaseResponse, KeyValueTypeStringModel } from '@hubgroup-share-system-fe/types/common.type';
import { WebsiteGetByIdRequest } from '@hubgroup-share-system-fe/types/website.type';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private http: TytHttpClient) {}

    async doLogout(): Promise<any> {
        return await this.http.get(environment.ssoUrl + '/Account/Logout');
    }

    async loginActivityNotify(request: LoginActivityNotifyRequest): Promise<BaseResponse<null>> {
        return await this.http.post(environment.ssoUrl + '/Account/LoginActivityNotify', request);
    }

    async verifyOtp(request: OtpVerifyRequest): Promise<BaseResponse<null>> {
        return await this.http.post(environment.ssoUrl + '/Account/VerifyOtp', request);
    }

    async sendOtp(): Promise<any> {
        return await this.http.post(environment.ssoUrl + '/Account/SendOtp', {});
    }

    async generateQr(request: QRGenerateRequest): Promise<BaseResponse<QRGenerateResponse>> {
        return await this.http.post(environment.ssoUrl + '/Account/GenerateQr', request);
    }

    async waitQrConfirmation(token: string): Promise<any> {
        return await this.http.post(environment.ssoUrl + '/Account/WaitQrConfirmation', { token });
    }

    async getWebsites(): Promise<any> {
        return await this.http.post('/Authentication/GetWebsites', {});
    }

    async websiteSelected(request: WebsiteSelectedRequest): Promise<any> {
        return await this.http.post('/Authentication/WebsiteSelected', request);
    }

    async ping() {
        return this.http.post('/Authentication/Ping', {});
    }

    async companySelected(request: CompanySelectedRequest) {
        return this.http.post('/Authentication/CompanySelected', request);
    }

    async reloadUserPermission() {
        return this.http.post('/Authentication/ReloadUserPermission', {});
    }

    async getWebsiteById(request: WebsiteGetByIdRequest): Promise<
        BaseResponse<{
            website?: KeyValueTypeStringModel;
        }>
    > {
        return this.http.post('/Authentication/GetWebsiteById', request);
    }
}
