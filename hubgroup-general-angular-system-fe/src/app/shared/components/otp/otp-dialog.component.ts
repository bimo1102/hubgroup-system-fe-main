import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../services/authentication.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SignalRService } from '../../services/signalr.service';
import { CommonService } from '../../common.service';
import { AuthService } from '../../../modules/auth';
import { OtpTypeEnum } from '@hubgroup-share-system-fe/enums/authentication.enum';
import { BaseResponse, KeyValueTypeStringModel } from '@hubgroup-share-system-fe/types/common.type';
import { CompanyAndWebsiteModel } from '@hubgroup-share-system-fe/types/account.type';
import {
    LoginActivityNotifyRequest,
    OtpVerifyRequest,
    QRGenerateRequest,
    WebsiteSelectedRequest,
} from '@hubgroup-share-system-fe/types/authentication.type';
import { AuthReloadEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { ConnectionStringEnum } from '@hubgroup-share-system-fe/enums/signal-message.enum';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-news-otp-dialog',
    templateUrl: './otp-dialog.component.html',
})
export class OtpDialogComponent implements OnInit {
    constructor(
        private messageService: NzMessageService,
        private angularSharedService: AngularSharedService,
        private translate: TranslateService,
        private authenticationService: AuthenticationService,
        private modal: NzModalRef,
        protected commonService: CommonService,
        private signalRService: SignalRService,
        private angularAuthService: AngularAuthService
    ) {}

    protected OtpTypeEnum = OtpTypeEnum;

    isLoading: boolean = false;
    message = '';

    websiteId = '';
    websites: Array<KeyValueTypeStringModel> = [];
    isWebsiteChange: boolean = false;

    companyId: string = '';
    companies: Array<CompanyAndWebsiteModel> = [];

    isLoadingVerifyOtp = false;
    isLoadingResendOtp = false;

    disabledResendOtp = false;
    labelResendOtp = '';

    qrImageReady = false;
    qrImage = '';
    qrToken = '';

    requestVerify: OtpVerifyRequest = {
        otp: '',
        type: OtpTypeEnum.SmartOTP,
    };

    requestLoginActivityNotify: LoginActivityNotifyRequest = {
        socketId: '',
    };

    async ngOnInit() {
        this.signalRService.onProcess(
            'Notify',
            (message: any) => {
                console.log(message);
                if (message.actionType !== 25 || message.value !== 'true') {
                    return;
                }
                this.commonService.currentReloadValue = AuthReloadEnum.ReloadGetUserByToken;
                this.modal.close(true);
            },
            'loginByApp'
        );

        this.setLabelOtp();

        const user = this.angularAuthService.currentUserValue;
        if (!user) {
            this.message = this.translate.instant('user.login.isnull');
        } else {
            if (user.companies?.length > 0) {
                this.companies = user.companies;
                this.setWebsiteByCompany(user.company?.id, user.website);
            } else {
                //this.message = 'user.login.permission.deny';
            }

            this.requestLoginActivityNotify.socketId = this.signalRService.getConnectionId();
            if (this.requestLoginActivityNotify.socketId) {
                await this.callApiLoginActivityNotify();
            } else {
                this.signalRService.onConnectSubscribe$.subscribe(async (obj) => {
                    if (
                        obj.key === ConnectionStringEnum.OnLoginSuccess ||
                        obj.key === ConnectionStringEnum.OnReconnected
                    ) {
                        this.requestLoginActivityNotify.socketId =
                            this.signalRService.getConnectionId();
                        await this.callApiLoginActivityNotify();
                    }
                });
            }
        }
    }

    protected isSetLoading() {
        if (this.isLoading) {
            this.messageService.warning('Please_Waiting');
            return false;
        }
        this.isLoading = true;
        return true;
    }

    public unSetLoading() {
        this.isLoading = false;
    }

    async callApiLoginActivityNotify() {
        const response = await this.onAction(
            this.authenticationService.loginActivityNotify.bind(this.authenticationService),
            this.requestLoginActivityNotify
        );
        this.message = this.getMessages(response.messages);
    }

    async onOtpVerify(otpForm: any) {
        const formValid = this.formValidate(otpForm);
        if (formValid) {
            const response = await this.onAction(
                this.authenticationService.verifyOtp.bind(this.authenticationService),
                this.requestVerify
            );
            this.message = this.getMessages(response.messages);

            // if (!this.isWebsiteChange) {
            //     this.modal.close(true);
            // } else
            if (response.status) {
                const request: WebsiteSelectedRequest = {
                    websiteId: this.websiteId,
                };
                const responseWebsiteSelect = await this.onAction(
                    this.authenticationService.websiteSelected.bind(this.authenticationService),
                    request
                );
                this.message = this.getMessages(response.messages);
                if (responseWebsiteSelect.status) {
                    this.modal.close(true);
                }
            }
        }
    }

    async onResendOtp() {
        this.isLoadingResendOtp = true;
        let response;
        if (this.requestVerify.type === OtpTypeEnum.SmartOTP) {
            let socketId = this.signalRService.getConnectionId();
            response = await this.authenticationService.loginActivityNotify({ socketId: socketId });
        } else if (this.requestVerify.type === OtpTypeEnum.QR) {
            let qrType = 2;
            let returnUrl = window.location.protocol + '//' + window.location.hostname;
            let viewMode = 'cms';

            const request: QRGenerateRequest = {
                qrType,
                returnUrl,
                viewMode,
            };

            response = await this.authenticationService.generateQr(request);
            if (response.status) {
                this.qrToken = response.data?.token;
                this.qrImage = response.data?.qrImage;
                this.qrImageReady = true;
            }
        } else {
            response = await this.authenticationService.sendOtp();
        }

        this.isLoadingResendOtp = false;
        if (!response.status) {
            this.message = this.getMessages(response.messages);
            return;
        }
        this.disabledResendOtp = true;
        let timeResend = 30;
        const interval = setInterval(() => {
            this.labelResendOtp = timeResend + '';
            timeResend--;
            if (timeResend <= 0) {
                this.setLabelOtp();

                this.disabledResendOtp = false;
                clearInterval(interval);
            }
        }, 1000);

        if (this.requestVerify.type === OtpTypeEnum.QR) {
            let waitQrConfirmationResponse = await this.authenticationService.waitQrConfirmation(
                this.qrToken
            );
            if (!waitQrConfirmationResponse.status) {
                this.message = this.getMessages(waitQrConfirmationResponse.messages);
                return;
            }
            this.modal.close(true);
        }
    }

    async onCompanyModelChange(companyId: string) {
        // const request: CompanySelectedRequest = {
        //     companyId,
        // };
        // const response = await this.onAction(this.authenticationService.companySelected.bind(this.authenticationService), request);
        // this.message = this.getMessages(response.messages);
        // if (response.status) {
        //     this.onWebsiteModelChange();
        // }
        this.setWebsiteByCompany(companyId);
    }

    setWebsiteByCompany(companyId?: string, website?: KeyValueTypeStringModel) {
        const companyFound = this.companies.find((item) => item.id === companyId);
        this.companyId = companyFound ? companyFound.id : this.companies[0].id;
        this.websites = (companyFound ? companyFound.websites : this.companies[0].websites) || [];

        this.websiteId = website ? website.id : this.websites.length > 0 ? this.websites[0].id : '';
    }

    onWebsiteModelChange() {
        this.isWebsiteChange = true;
    }

    formValidate(form: any): boolean {
        const valid = form.valid;
        if (valid) {
            return true;
        } else {
            let controls: any[] = form.controls;
            Object.values(controls).forEach((control) => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            return false;
        }
    }

    getMessages(messages: string[]) {
        return messages?.length > 0
            ? messages.map((item) => this.translate.instant(item)).join(', ')
            : '';
    }

    async onAction<RT, T>(funcProcess: (request: RT) => Promise<BaseResponse<T>>, request: RT) {
        this.isSetLoading();
        let response = await funcProcess(request);
        this.unSetLoading();

        return response;
    }

    async onLogout() {
        this.isLoadingResendOtp = true;
        let response = await this.authenticationService.doLogout();
        this.isLoadingResendOtp = false;
        if (!response.status) {
            this.message = this.getMessages(response.messages);
            return;
        }
        window.location.reload();
    }

    setLabelOtp() {
        if (this.requestVerify.type === OtpTypeEnum.SmartOTP) {
            this.labelResendOtp = this.translate.instant('otp.notify.resend');
        } else if (this.requestVerify.type === OtpTypeEnum.QR) {
            this.labelResendOtp = this.translate.instant('otp.qr.resend');
        } else {
            this.labelResendOtp = this.translate.instant('otp.resend');
        }
    }
}
