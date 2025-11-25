import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Subscription } from 'rxjs';
import { Common } from './common';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import HttpStatusCodeEnum from '@hubgroup-share-system-fe/enums/status-response.enum';
import { AngularEnvironmentService, AngularSharedService } from 'nexussoft-angular-shared';
import StatusResponseEnum from '@hubgroup-share-system-fe/enums/status-response.enum';
import axios, { AxiosError, AxiosHeaders } from 'axios';
import { LoginTypeEnum } from '@hubgroup-share-system-fe/enums/account.enum';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TytHttpClient implements OnDestroy {
    constructor(
        private http: HttpClient,
        private angularEnvironmentService: AngularEnvironmentService,
        private angularSharedService: AngularSharedService,
        private router: Router
    ) {
        const subscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.unsubscribeAll();
            }
        });
        axios.interceptors.response.use(
            (response) => {
                return response.data;
            },
            async (error) => {
                if (error instanceof AxiosError) {
                    if (error.status == StatusResponseEnum.UNAUTHORIZED) {
                        const refreshToKen = localStorage.getItem(Common.AuthRefreshStorageToken);
                        if (refreshToKen) {
                            const response = await axios.post(
                                environment.ssoUrl + '/Account/RefreshToken',
                                {
                                    RefreshToken: refreshToKen,
                                    AccountType: LoginTypeEnum.CustomerApp,
                                    DeviceInfo: 'DeviceLoginInfo',
                                },
                                {
                                    headers: this.header(),
                                    withCredentials: true,
                                }
                            );
                            if (response?.data) {
                                const token = response?.data?.token;
                                const refreshToken = response?.data?.refreshToken;
                                if (token && refreshToken) {
                                    Common.setTokenToLocalStorage(token);
                                    Common.setRefreshTokenToLocalStorage(refreshToken);
                                    if (error.config) {
                                        error.config.headers.Authorization = `Bearer ${token}`;
                                        return axios(error.config);
                                    }
                                }
                            }
                            localStorage.removeItem(Common.AuthLocalStorageToken);
                            localStorage.removeItem(Common.AuthRefreshStorageToken);
                        }
                    }
                }
                return Promise.reject(error?.response);
            }
        );
    }

    protected unsubscribe: Subscription[] = [];

    ngOnDestroy() {
        this.unsubscribeAll();
    }

    unsubscribeAll(): void {
        this.unsubscribe.forEach((sb) => {
            sb.unsubscribe();
        });
        this.angularSharedService.currentLoadingValue = false;
    }

    makeUrl(path: string, router: string = ''): string {
        if (path && path.startsWith('http')) {
            return path;
        }
        if (!router) {
            router = this.angularEnvironmentService.environment.apiRouter || 'api';
        }
        return `${this.angularEnvironmentService.environment.apiUrl}/${router}${path}`;
    }

    getToken(): string {
        return <string>localStorage.getItem(Common.AuthLocalStorageToken);
    }

    header() {
        let token = this.getToken();
        return {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${token}`,
            ClientWebsiteId: this.angularEnvironmentService.environment.clientWebsiteId || '',
        };
    }

    headerFormData() {
        let token = this.getToken();
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
            ClientWebsiteId: this.angularEnvironmentService.environment.clientWebsiteId || '',
        });
    }

    headerFormDataObject(headerObject: any) {
        let token = this.getToken();
        const headerData: any = {
            Authorization: `Bearer ${token}`,
            ClientWebsiteId: this.angularEnvironmentService.environment.clientWebsiteId || '',
        };
        if (headerObject != null) {
            for (let key of Object.keys(headerObject)) {
                headerData[key] = headerObject[key];
            }
        }
        return new HttpHeaders(headerData);
    }

    async get(urlPath: string, router = ''): Promise<any> {
        const url: string = this.makeUrl(urlPath, router);
        const headers = this.header();
        const t = axios.get(url, { headers: headers, withCredentials: true });
        let isError = false;
        const response = await t.then(this.extractData).catch((err) => {
            isError = true;
            return this.handleError(err);
        });
        if (isError) {
            return response.json() as any;
        }
        return response;
    }

    async getBlobFile(urlPath: string, router = ''): Promise<any> {
        const url: string = this.makeUrl(urlPath, router);
        const headers = this.header();
        const t = axios.get(url, { headers: headers, responseType: 'blob', withCredentials: true });
        let isError = false;
        const response = await t.then(this.extractData).catch((err) => {
            isError = true;
            return this.handleError(err);
        });
        if (isError) {
            return response.json() as any;
        }
        return response;
    }

    async post(urlPath: string, obj: any, responseType = 'json'): Promise<any> {
        const url: string = this.makeUrl(urlPath, '');
        const headers = this.header();
        const t = axios.post(url, obj, {
            headers: headers,
            responseType: responseType as any,
            withCredentials: true,
        });
        let isError = false;
        // const response = await new Promise((resolve, reject) => {
        //     const unsub = t.subscribe({
        //         next: data => {
        //             resolve(data);
        //         },
        //         error: (error: HttpErrorResponse) => {
        //             reject(error);
        //         },
        //     });
        //     this.unsubscribe.push(unsub);
        // }).then(this.extractData)
        const response = await t.then(this.extractData).catch((err) => {
            isError = true;
            return this.handleError(err);
        });
        if (isError) {
            return response.json();
        }
        return response;
    }

    async downloadFile(
        urlPath: string,
        obj: any,
        func: (event: HttpEvent<Blob>) => void
    ): Promise<any> {
        const url: string = this.makeUrl(urlPath, '');
        const subscription: Subscription = this.http
            .post(url, obj, {
                headers: this.header(),
                responseType: 'blob',
                observe: 'events',
                reportProgress: true,
            })
            .subscribe((event) => {
                func(event);
            });
        this.unsubscribe.push(subscription);
    }

    public async getDownloadFile(urlPath: string, router = ''): Promise<Blob> {
        const url: string = this.makeUrl(urlPath, router);
        const headers = this.header();
        const t = axios.get(url, { headers: headers, responseType: 'blob' });
        let isError = false;
        const response = await t.then(this.extractData).catch((err) => {
            isError = true;
            return this.handleError(err);
        });
        if (isError) {
            return response.json() as any;
        }
        return response;
    }

    postUploadFile(urlPath: string, obj: any, headerObject: any = null, router = '') {
        const url: string = this.makeUrl(urlPath, router);
        const headers = this.headerFormDataObject(headerObject);
        return this.http.post(url, obj, { headers: headers });
    }

    async postWithCredentials(urlPath: string, obj: any, router = ''): Promise<any> {
        const url: string = this.makeUrl(urlPath, router);
        //const headers = this.header();
        const t = axios.post(url, obj, { withCredentials: true });
        let isError = false;
        const response = await t.then(this.extractData).catch((err) => {
            isError = true;
            return this.handleError(err);
        });
        if (isError) {
            return response.json() as any;
        }
        return response;
    }

    // async postWithBearerToken(urlPath: string, token: string, obj: any, router = ''): Promise<any> {
    //     const url: string = this.makeUrl(urlPath, router);
    //     const headers = new HttpHeaders({
    //         'Authorization': `Bearer ${token}`,
    //         'ClientWebsiteId': ,
    //     });
    //     const t = this.http.post(url, obj, { headers: headers });
    //     let isError = false;
    //     const response = await firstValueFrom(t).then(this.extractData)
    //         .catch(err => {
    //             isError = true;
    //             return this.handleError(err);
    //         });
    //     if (isError) {
    //         const result = response.json() as any;
    //         return result;
    //     }
    //     return response;
    // }

    private extractData(res: any) {
        // let body = res.json();
        // return body || {};
        return res || {};
    }

    private handleError(error: any): Promise<any> {
        console.log(error);
        let errObject;
        switch (error.status) {
            case 0:
                {
                    errObject = {
                        json: function () {
                            return {
                                status: false,
                                messages: ["Can't connect to server"],
                                responseStatus: error.status,
                            };
                        },
                    };
                }
                break;
            case HttpStatusCodeEnum.UNAUTHORIZED:
                {
                    errObject = {
                        json: function () {
                            return {
                                status: false,
                                messages: ['Unauthorized'],
                                responseStatus: error.status,
                                error: error.error,
                            };
                        },
                    };
                }
                break;
            case HttpStatusCodeEnum.FORBIDDEN:
                {
                    errObject = {
                        json: function () {
                            return {
                                status: false,
                                messages: ['Permission denied'],
                                responseStatus: error.status,
                                error: error.error,
                            };
                        },
                    };
                }
                break;
            default:
                {
                    errObject = {
                        json: function () {
                            return {
                                status: false,
                                messages: [error.status + ':' + error.statusText],
                                responseStatus: error.status,
                                error: error.error,
                            };
                        },
                    };
                }
                break;
        }
        return Promise.resolve(errObject);
    }
}
