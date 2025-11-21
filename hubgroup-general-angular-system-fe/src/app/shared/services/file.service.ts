import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import { HttpEvent } from '@angular/common/http';
import {
    DownloadByUrlsRequest,
    DownloadFromOutsideModel,
    FileGetByIdsRequest,
    FileUploadResponse,
    ImageModel,
} from '@hubgroup-share-system-fe/types/file.type';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';
import { AngularEnvironmentService } from 'nexussoft-angular-shared';

@Injectable({ providedIn: 'root' })
export class FileService {
    constructor(
        private httpClient: TytHttpClient,
        private angularEnvironmentService: AngularEnvironmentService
    ) {
        this.apiCDNUrl = this.angularEnvironmentService.environment.apiCDNUrl || '';
    }
    apiCDNUrl = '';

    upload(formData: any): any {
        return this.httpClient.postUploadFile(this.apiCDNUrl + '/File/Upload', formData);
    }

    uploadWithUrl(formData: any, uploadUrl: string) {
        return this.httpClient.postUploadFile(uploadUrl, formData);
    }

    uploadWithUrlWithHeader(formData: any, uploadUrl: string, header: any) {
        return this.httpClient.postUploadFile(uploadUrl, formData, header);
    }

    async downloadFromOutside(
        request: DownloadFromOutsideModel
    ): Promise<BaseResponse<FileUploadResponse>> {
        return await this.httpClient.post(this.apiCDNUrl + '/File/DownloadFromOutside', request);
    }

    async asyncUploadBase64(request: any) {
        return await this.httpClient.post(this.apiCDNUrl + '/File/AsyncUploadBase64', request);
    }

    downloadByUrls(request: DownloadByUrlsRequest, func: (event: HttpEvent<Blob>) => void) {
        return this.httpClient.downloadFile(this.apiCDNUrl + '/File/DownloadByUrls', request, func);
    }

    imageGetByIds(request: FileGetByIdsRequest): Promise<
        BaseResponse<{
            totalRow: number;
            models: Array<ImageModel>;
        }>
    > {
        return this.httpClient.post('/FileManager/ImageGetByIds', request);
    }
}
