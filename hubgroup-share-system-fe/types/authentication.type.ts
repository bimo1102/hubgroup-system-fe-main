import { OtpTypeEnum, QRTypeEnum } from '../enums/authentication.enum';

export interface OtpVerifyRequest {
    otp: string;
    type: OtpTypeEnum;
    sessionId?: string;
    isApp?: boolean;
}

export interface LoginActivityNotifyRequest {
    socketId: string;
}

export interface QRGenerateRequest {
    qrType: QRTypeEnum;
    returnUrl?: string;
    viewMode?: string;
}

export interface QRGenerateResponse {
    token: string;
    qrImage: string;
}

export interface CompanySelectedRequest {
    companyId: string;
}

export interface WebsiteSelectedRequest {
    websiteId: string;
}
