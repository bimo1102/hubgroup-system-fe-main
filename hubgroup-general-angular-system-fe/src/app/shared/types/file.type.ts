import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { FileUploadResponse } from '@hubgroup-share-system-fe/types/file.type';

export interface UploadFile extends NzUploadFile {
    response?: FileUploadResponse;
}

export interface UploadChangeParam extends NzUploadChangeParam {
    file: UploadFile;
    fileList: UploadFile[];
    inValid?: boolean;
    message?: any;
}
