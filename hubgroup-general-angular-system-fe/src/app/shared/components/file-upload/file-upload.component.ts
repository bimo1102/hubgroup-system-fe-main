import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { FileService } from '../../services/file.service';
import { ModuleBaseComponent } from '../../base-components/module-base-component';
import { CommonService } from '../../common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileUploadType } from '@hubgroup-share-system-fe/enums/file-manager.enum';
import { UploadChangeParam } from '../../types/file.type';
import HttpStatusCodeEnum from '@hubgroup-share-system-fe/enums/status-response.enum';
import { AngularEnvironmentService, AngularSharedService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-news-file-upload',
    templateUrl: './file-upload.component.html',
})
export class FileUploadComponent extends ModuleBaseComponent implements OnInit {
    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private fileService: FileService,
        private angularEnvironmentService: AngularEnvironmentService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    @Input() permissionKey = '';
    @Input() checkPermission = true;

    @Input() buttonText = 'button.file.upload';
    @Input() buttonClass = '';
    @Input() buttonIcon: boolean = false;
    @Input() fileExt = 'JPG, GIF, PNG';
    @Input() name = 'fileUpload';

    @Input() maxSize = 100;
    @Input() showUploadList:
        | boolean
        | {
              showPreviewIcon?: boolean;
              showRemoveIcon?: boolean;
              showDownloadIcon?: boolean;
          } = { showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: false };
    @Input() fileList: NzUploadFile[] = [];
    @Input() folderId: any;
    @Input() header: any;

    @Input() isMultiple: boolean = false;
    @Input() limitUpload: number = 50;

    @Input() fileUploadType: FileUploadType = FileUploadType.Default;

    @Input() allowedFileTypes = '';
    @Output() changeFunc = new EventEmitter<UploadChangeParam>();
    @Output() progressFunc = new EventEmitter<UploadChangeParam>();
    @Output() removeFunc = new EventEmitter<any>();
    @Output() beforeUploadFunc = new EventEmitter<Array<NzUploadFile>>();

    loading = false;
    uploadUrl = '';

    ngOnInit() {
        switch (this.fileUploadType) {
            case FileUploadType.System:
                this.uploadUrl =
                    this.angularEnvironmentService.environment.apiCDNUrl + '/File/SystemUpload';
                break;
            case FileUploadType.SystemUploadForCurrentUser:
                this.uploadUrl =
                    this.angularEnvironmentService.environment.apiCDNUrl +
                    '/File/SystemUploadForCurrentUser';
                break;
            case FileUploadType.Default:
                this.uploadUrl =
                    this.angularEnvironmentService.environment.apiCDNUrl + '/File/Upload';
                break;
        }
    }

    beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): Observable<boolean> => {
        if (
            this.fileUploadType === FileUploadType.System ||
            this.fileUploadType === FileUploadType.SystemUploadForCurrentUser
        ) {
            this.beforeUploadFunc.emit(fileList);
            return new Observable((observer) => {
                observer.next(true);
                observer.complete();
            });
        }

        return new Observable((observer) => {
            const imageTypes: any = [
                'image/png',
                'image/jpeg',
                'image/gif',
                'image/bmp',
                'image/avif',
                'image/webp',
                'application/pdf',
            ];
            if (
                imageTypes.includes(file.type) &&
                (this.folderId == null || this.folderId.length === 1)
            ) {
                const message = this.translate.instant('File.Folder.IsRequired');
                this.changeFunc.emit({
                    file,
                    fileList,
                    inValid: true,
                    message,
                });
                observer.complete();
                return;
            }
            const isLt2M = file.size! / 1024 / 1024 < this.maxSize;
            if (!isLt2M) {
                const message = this.translate.instant(
                    'File must smaller than ' + this.maxSize + 'MB!'
                );
                this.changeFunc.emit({
                    file,
                    fileList,
                    inValid: true,
                    message,
                });
                observer.complete();
                return;
            }
            this.beforeUploadFunc.emit(fileList);
            observer.next(isLt2M);
            observer.complete();
        });
    };

    handleChange(info: UploadChangeParam) {
        switch (info.file.status) {
            case 'uploading':
                this.loading = true;
                break;
            case 'done':
                this.loading = false;
                break;
            case 'error':
                this.loading = false;
                break;
        }

        this.progressFunc.emit(info);

        if (this.changeFunc && info.file.response?.status) {
            this.changeFunc.emit({ ...info, inValid: false });
        } else if (
            !info.file.response?.status &&
            info.file.response?.messages &&
            info.file.status !== 'removed'
        ) {
            info.file.status = 'error';
            const fileInValid = info.fileList.find((file) => file.uid === info.file.uid);
            if (fileInValid) {
                fileInValid.status = 'error';
            }

            const message = this.getMessages(info.file.response.messages);
            this.showMessageWarning(info.file.name + ' ' + this.translate.instant(message));
            this.changeFunc.emit({ ...info, inValid: true });
        }
    }

    onCustomRequest = (item: NzUploadXHRArgs) => {
        const formData = new FormData();
        formData.append('name', item.file.name);
        if (item.file.type) formData.append('type', item.file.type);
        formData.append('files', item.file as any);
        let sub = this.header
            ? this.fileService.uploadWithUrlWithHeader(formData, this.uploadUrl, this.header)
            : this.fileService.uploadWithUrl(formData, this.uploadUrl);

        return sub.subscribe({
            next: (event: any) => {
                if (event.type === HttpEventType.UploadProgress) {
                    if (event.total && event.total > 0) {
                        event.percent = (event.loaded / event.total) * 100;
                    }
                    if (item.onProgress) item.onProgress(event, item.file);
                } else {
                    if (item.onSuccess) item.onSuccess(event, item.file, null);
                }
            },
            error: (err) => {
                console.log('FileManagerTableComponent > err ', err);
                if (err?.status === HttpStatusCodeEnum.UNAUTHORIZED) {
                    this.showLoginDialog();
                }
                item.onError!(err, item.file!);
            },
        });
    };

    handleRemoveFile = (file: NzUploadFile) => {
        return new Observable<boolean>((obs) => {
            this.removeFunc.emit(file);
            obs.next(true);
        });
    };
}
