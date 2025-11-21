import { ChangeDetectorRef, inject, Injectable, OnDestroy, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../common.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { LoginDialogComponent } from '../components/login/login-dialog.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { debounce, distinctUntilChanged, Observable, of, Subject, Subscription, timer } from 'rxjs';
import { endOfMonth, isDate, startOfMonth, subMonths, subWeeks, subYears, toDate } from 'date-fns';
import { OtpDialogComponent } from '../components/otp/otp-dialog.component';
import { isArray, isFunction, isObject } from 'lodash';
import { NgForm } from '@angular/forms';
import classNames from 'classnames';
import { IdleTimeOutComponent } from '../components/idle-time-out/idle-time-out.component';
import { IdleTimeOutWarningComponent } from '../components/idle-time-out-warning/idle-time-out-warning.component';
import { WebsiteSelectDialogComponent } from '../components/website-select/website-select-dialog.component';
import { AuthReloadEnum, BreakpointEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { BaseResponse, KeyValueTypeStringModel } from '@hubgroup-share-system-fe/types/common.type';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { UserLoginCompletedResponse } from '@hubgroup-share-system-fe/types/account.type';
import { Common } from '../common';
import StatusResponseEnum from '@hubgroup-share-system-fe/enums/status-response.enum';
import { ImageResponseType } from '@hubgroup-share-system-fe/types/file-manager.type';
import { FileManagerDialogComponent } from '../components/file-manager-dialog/file-manager-dialog.component';
import { FileManagerSettingParams } from '@hubgroup-share-system-fe/types/file.type';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { FolderIdTypeEnum } from '@hubgroup-share-system-fe/enums/file-manager.enum';

@Injectable({ providedIn: 'root' })
export class ModuleBaseComponent implements OnDestroy {
    constructor(
        protected cdr: ChangeDetectorRef,
        protected translate: TranslateService,
        protected commonService: CommonService,
        protected modalService: NzModalService,
        protected messageService: NzMessageService,
        protected angularSharedService: AngularSharedService
    ) {
        this.isLoading$ = this.angularSharedService.isLoading$;
        this.screenSize$ = this.angularSharedService.screenSize$.asObservable();
        this.isSkeleton$ = this.commonService.isSkeletonSubject$.asObservable();

        const subscription = this.angularSharedService.isDesktop$.subscribe((value) => {
            this.responsive = {
                ...this.responsive,
                isDesktop: value,
            };
        });
        this.unsubscribe.push(subscription);

        const subscriptionMobile = this.angularSharedService.isMobile$.subscribe((value) => {
            this.responsive = {
                ...this.responsive,
                isMobile: value,
            };
        });
        this.unsubscribe.push(subscriptionMobile);

        const activatedRoute = inject(ActivatedRoute);
        const { data } = activatedRoute.snapshot;
        if (data?.moduleName) {
            this.commonService.handleLocale().then();
        }
    }

    protected unsubscribe: Subscription[] = [];
    protected eventListeners: Array<() => void> = [];
    isLoading$: Observable<boolean>;
    screenSize$: Observable<Array<BreakpointEnum>>;
    isSkeleton$: Observable<boolean>;
    message = '';
    nzFilterOption = (): boolean => false;

    protected readonly noImage: string =
        environment.origin + environment.baseHref + '/assets/images/no-image.jpg';
    protected readonly noImageMobile: string =
        environment.origin + environment.baseHref + '/assets/images/no-image-mobile.png';
    protected readonly dateFormat: string = 'dd/MM/yyyy';
    protected readonly dateFormatServer: string = 'yyyy-MM-dd';
    protected readonly timeFormat: string = 'HH:mm';
    protected readonly timeFormatFull: string = 'HH:mm:ss';
    protected readonly dateTimeFormat: string = `${this.dateFormat} ${this.timeFormat}`;
    protected readonly dateTimeFormatFull: string = `${this.dateFormat} ${this.timeFormatFull}`;
    protected readonly dateTimeFormatServer: string = `${this.dateFormatServer}:${this.timeFormatFull}`;

    protected pageSize = 25;
    protected pageSizeServer = 30;
    protected pageIndex = 0;
    protected totalRow = 0;
    protected readonly listPageSize = [5, 10, 15, 25, 50, 100, 500, 1000];

    protected dateNowUtc: Date = this.getDateUtc();
    protected dateSubWeeks: any[] = [subWeeks(this.dateNowUtc, 1), toDate(this.dateNowUtc)];
    protected dateSubMonths: any[] = [subMonths(this.dateNowUtc, 1), toDate(this.dateNowUtc)];
    protected isLoadingModal: boolean = false;

    private static isShowLoginDialog = false;
    private loginDialogModalRef: NzModalRef<LoginDialogComponent, any>;

    protected readonly classNames = classNames;
    protected readonly BreakpointEnum = BreakpointEnum;
    protected responsive = {
        isDesktop: false,
        isMobile: false,
    };

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
        this.eventListeners.forEach((fn) => fn());
    }

    protected setLoading(isMultipleProcess: boolean = false) {
        const isLoading = this.angularSharedService.currentLoadingValue;

        if (isLoading && !isMultipleProcess) {
            this.messageService.warning(this.translate.instant('Please_Waiting'));
            return false;
        }
        this.isLoadingModal = true;
        this.angularSharedService.currentLoadingValue = true;
        return true;
    }

    protected unSetLoading() {
        this.angularSharedService.currentLoadingValue = false;
        this.isLoadingModal = false;
    }

    protected async onAction(
        isCheckLoading: boolean,
        func: any,
        params: any,
        options?: {
            keepParams?: boolean;
            callback?: () => void;
            multipleProcess?: boolean;
        }
    ) {
        try {
            if (isCheckLoading) {
                const isLoading = this.setLoading(!!options?.multipleProcess);
                if (!isLoading && !options?.multipleProcess) {
                    console.log('isCheckLoading', func);
                    return {
                        status: false,
                        messages: ['please wait'],
                    };
                }
            }

            let response;
            if (isArray(params) && !options?.keepParams) {
                response = await func(...params);
            } else {
                response = await func(params);
            }
            if (response.responseStatus) {
                this.angularSharedService.currentResponseStatus = response.responseStatus;
                if (
                    response.responseStatus === StatusResponseEnum.UNAUTHORIZED &&
                    isFunction(options?.callback)
                ) {
                    this.angularSharedService.callbackAfterAuthentication.push(options!.callback);
                }
            }
            return response;
        } catch (e) {
            console.log(e);
        } finally {
            if (isCheckLoading) {
                this.unSetLoading();
            }
        }
    }

    protected onActionDelay<T = any>(
        subject$: Subject<T>,
        actionFunc: (term: T) => void,
        delay = 300
    ) {
        const subscription = subject$
            .pipe(
                debounce((ev) => {
                    return !ev || (isObject(ev) && !(ev as any).keyword && !(ev as any).name)
                        ? of('')
                        : timer(delay);
                }),
                distinctUntilChanged()
            )
            .subscribe((term: T) => {
                actionFunc(term);
            });

        this.unsubscribe.push(subscription);
    }

    private isShowDialogByLocalStorageAuth() {
        if (!ModuleBaseComponent.isShowLoginDialog) {
            ModuleBaseComponent.isShowLoginDialog = true;
            return true;
        }
        return false;
    }

    protected handleLocalStorageAuthInitAndAfterCloseDialog() {
        ModuleBaseComponent.isShowLoginDialog = false;
    }

    protected showLoginDialog() {
        if (!this.isShowDialogByLocalStorageAuth()) return;

        const loginDialogModalRef = this.modalService.create({
            nzTitle: '',
            nzFooter: null,
            nzClassName: 'card-modal',
            nzMaskStyle: {},
            nzContent: LoginDialogComponent,
            nzClosable: false,
            nzKeyboard: false,
            nzMaskClosable: false,
            nzWidth: 850,
        });
        const subscribe1 = loginDialogModalRef.afterClose.subscribe(
            (data?: UserLoginCompletedResponse) => {
                this.handleLocalStorageAuthInitAndAfterCloseDialog();
                if (data) {
                    Common.setTokenToLocalStorage(data.token);
                    this.commonService.currentReloadValue = AuthReloadEnum.ReloadGetUserByToken;
                }
            }
        );
        this.unsubscribe.push(subscribe1);
    }

    protected showOTPDialog() {
        if (!this.isShowDialogByLocalStorageAuth()) return;

        const otpDialog = this.modalService.create({
            nzTitle: this.translate.instant('otp.dialog.title'),
            nzFooter: null,
            nzClassName: 'card-modal',
            nzMaskStyle: {},
            nzContent: OtpDialogComponent,
            nzClosable: false,
            nzKeyboard: false,
            nzMaskClosable: false,
            nzWidth: 600,
            nzBodyStyle: {
                paddingRight: '15px',
                paddingLeft: '15px',
            },
        });
        const subscribe1 = otpDialog.afterClose.subscribe((result) => {
            this.handleLocalStorageAuthInitAndAfterCloseDialog();
            this.commonService.currentReloadValue = AuthReloadEnum.ReloadGetUserByToken;
        });
        this.unsubscribe.push(subscribe1);
    }

    protected showWebsiteChangeDialog() {
        if (!this.isShowDialogByLocalStorageAuth()) return;
        const otpDialog = this.modalService.create({
            nzTitle: this.translate.instant('website.change.dialog.title'),
            nzFooter: null,
            nzClassName: 'card-modal custom-card',
            nzMaskStyle: {},
            nzContent: WebsiteSelectDialogComponent,
            //nzComponentParams: {},
            nzClosable: false,
            nzKeyboard: false,
            nzMaskClosable: false,
            nzWidth: 600,
            nzBodyStyle: {
                paddingRight: '15px',
                paddingLeft: '15px',
            },
        });
        const subscribe = otpDialog.afterClose.subscribe((result) => {
            this.handleLocalStorageAuthInitAndAfterCloseDialog();
        });
        this.unsubscribe.push(subscribe);
    }

    protected showIdleTimeOut() {
        if (!this.isShowDialogByLocalStorageAuth()) return;
        this.onShowDialogModalSmall('', IdleTimeOutComponent, {}, {}, () => {
            this.handleLocalStorageAuthInitAndAfterCloseDialog();
            this.commonService.currentReloadValue = AuthReloadEnum.ReloadGetUserByToken;
        });
    }

    protected showIdleTimeOutWarning() {
        if (!this.isShowDialogByLocalStorageAuth()) return;
        this.onShowDialogModalSmall('', IdleTimeOutWarningComponent, {}, {}, () => {
            this.handleLocalStorageAuthInitAndAfterCloseDialog();
        });
    }

    protected onShowDialogModalLarge(
        title: string,
        component: any,
        dataUi: any,
        data: any,
        afterCloseFunc: any
    ) {
        const modal: NzModalRef = this.modalService.create({
            nzTitle: title,
            nzClassName: 'card-modal custom-card',
            nzWidth: dataUi?.width || '98%',
            nzFooter: null,
            nzCentered: true,
            nzContent: component,
            nzData: data,
            nzMaskClosable: false,
            nzClosable: dataUi?.closable ?? false,
            nzBodyStyle: dataUi?.bodyStyle || {
                padding: this.responsive.isDesktop ? '14px' : 0,
            },
        });
        this.angularSharedService.addCurrentModalIsOpen(modal);

        if (afterCloseFunc) {
            const subscribe = modal.afterClose.subscribe((result) => {
                this.angularSharedService.removeCurrentModalIsOpen(modal);
                afterCloseFunc(result);
            });
            this.unsubscribe.push(subscribe);
        }
        return modal;
    }

    protected onShowDialogModalMedium(
        title: string | TemplateRef<{}>,
        component: any,
        dataUi: any,
        data: any,
        afterCloseFunc: any
    ) {
        const modal: NzModalRef = this.modalService.create({
            nzTitle: title,
            nzClassName: 'card-modal custom-card',
            nzWidth: this.angularSharedService.screenSize$.value.includes(BreakpointEnum.XXl)
                ? '75%'
                : '98%',
            nzFooter: null,
            nzCentered: true,
            nzContent: component,
            nzData: data,
            nzClosable: dataUi?.closable ?? false,
            nzBodyStyle: dataUi?.bodyStyle || {
                padding: this.responsive.isDesktop ? '14px' : 0,
            },
            nzMaskClosable: false,
        });
        this.angularSharedService.addCurrentModalIsOpen(modal);
        if (afterCloseFunc) {
            const subscribe = modal.afterClose.subscribe((result) => {
                this.angularSharedService.removeCurrentModalIsOpen(modal);
                afterCloseFunc(result);
            });
            this.unsubscribe.push(subscribe);
        }
        return modal;
    }

    protected onShowDialogModalSmall(
        title: string | TemplateRef<{}>,
        component: any,
        dataUi: any,
        data: any,
        afterCloseFunc: (result?: any) => void,
        afterOpenFunc?: () => void
    ) {
        const modal: NzModalRef = this.modalService.create({
            nzTitle: title,
            nzClassName: 'card-modal custom-card',
            nzWidth: !this.responsive.isDesktop ? '98%' : '50%',
            nzFooter: null,
            nzCentered: true,
            nzContent: component,
            nzData: data,
            nzClosable: dataUi?.closable ?? false,
            nzBodyStyle: dataUi?.bodyStyle || {
                padding: this.responsive.isDesktop ? '14px' : 0,
            },
            nzMaskClosable: false,
        });
        this.angularSharedService.addCurrentModalIsOpen(modal);
        if (afterOpenFunc) {
            const subscribe = modal.afterOpen.subscribe(() => {
                afterOpenFunc();
            });
            this.unsubscribe.push(subscribe);
        }
        if (afterCloseFunc) {
            const subscribe = modal.afterClose.subscribe((result) => {
                this.angularSharedService.removeCurrentModalIsOpen(modal);
                afterCloseFunc(result);
            });
            this.unsubscribe.push(subscribe);
        }
        return modal;
    }

    protected showFileManagerDialog(
        data: Partial<FileManagerSettingParams> = {},
        callback?: (files?: ImageResponseType[]) => void
    ) {
        if (!data.defaultSelectedFolderId) {
            data.defaultSelectedFolderId = FolderIdTypeEnum.News;
        }
        const fileManagerModalRef = this.modalService.create({
            nzTitle: '',
            nzFooter: null,
            nzClassName: 'card-modal custom-card',
            nzMaskStyle: {},
            nzContent: FileManagerDialogComponent,
            nzClosable: false,
            nzMaskClosable: false,
            nzCentered: true,
            nzWidth: '100%',
            nzData: { ...data },
        });
        const subscribeReference = fileManagerModalRef.afterClose.subscribe((files) => {
            if (callback && typeof callback == 'function') {
                callback(files);
            }
        });
        this.unsubscribe.push(subscribeReference);
    }

    protected formValidate(form: NgForm): boolean {
        const valid = form.valid;
        if (valid) {
            return true;
        } else {
            Object.values(form.controls).forEach((control) => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            return false;
        }
    }

    protected getMessages(messages: string[]) {
        return messages?.length > 0
            ? messages.map((item) => this.translate.instant(item)).join(', ')
            : '';
    }

    protected showMessageSuccess(message: string) {
        this.messageService.success(message);
    }

    protected showMessageWarning(message: string) {
        this.messageService.warning(message);
    }

    protected showMessageInfo(message: string) {
        this.messageService.info(message);
    }

    protected showMessageError(message: string) {
        this.messageService.error(message);
    }

    protected handleMessageErrorByStatus(response: Pick<BaseResponse<any>, 'status' | 'messages'>) {
        if (response?.status) {
            this.message = '';
        } else if (!response?.status && response?.messages) {
            this.message =
                this.getMessages(response.messages) ||
                this.translate.instant('error.message.default');
            this.showMessageWarning(this.message);
        }
    }

    protected handleMessageFormInvalid(
        form: NgForm,
        formElement: HTMLFormElement,
        scrollToElementInvalid: boolean = true
    ) {
        const nameControl = Object.keys(form.controls).find((key) => form.controls[key].invalid);
        let message = 'please.fill.data';
        if (nameControl) {
            const errorControl = form.controls[nameControl].errors;
            if (errorControl?.required) {
                message = nameControl + '.warning.required';
            } else if (errorControl?.customMaxLength) {
                message = nameControl + '.warning.customMaxLength';
            }
        }

        if (scrollToElementInvalid) {
            const elementInvalid = formElement.querySelector(`[name="${nameControl}"]`);
            if (elementInvalid)
                elementInvalid.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest',
                });
        }

        this.showMessageWarning(this.translate.instant(message));
    }

    protected getDateUtc(date: Date = new Date()) {
        if (!isDate(date)) date = new Date();
        return toDate(date.setUTCHours(0, 0, 0, 0));
    }

    protected getDateRanges() {
        const today = this.getDateUtc();
        const subMonthsToday = subMonths(today, 1);
        const subYearToday = subYears(today, 1);
        return {
            [this.translate.instant('Today')]: [today, today],
            [this.translate.instant('This subWeeks')]: [subWeeks(today, 1), today],
            [this.translate.instant('This subMonths')]: [
                startOfMonth(subMonthsToday),
                endOfMonth(subMonthsToday),
            ],
            [this.translate.instant('This Month')]: [startOfMonth(today), endOfMonth(today)],
            // [this.translate.instant('This subYears')]: [startOfYear(subYearToday), endOfYear(subYearToday)],
            // [this.translate.instant('This Year')]: [startOfYear(today), endOfYear(today)],
        };
    }

    protected onChangeDate(dates: Date[], dateParam: any[] = this.dateSubMonths) {
        if (isArray(dates) && dates.length > 0 && dateParam) {
            dateParam = [
                toDate(dates[0].setUTCHours(0, 0, 0, 0)),
                toDate(dates[1].setUTCHours(0, 0, 0, 0)),
            ];
        }
        return dateParam;
    }

    setupAutocomplete<RT, RESPONSE_TYPE = KeyValueTypeStringModel>(
        request$: Subject<Partial<RT>>,
        config: {
            request?: Partial<RT>;
            service: (request: RT) => Promise<BaseResponse<Array<RESPONSE_TYPE>>>;
        },
        callback: (sources: Array<RESPONSE_TYPE>) => void
    ) {
        this.onActionDelay<Partial<RT>>(
            request$,
            async (requestParam: Partial<RT>) => {
                let request = {
                    pageIndex: this.pageIndex,
                    ...requestParam,
                };
                if (config.request) {
                    request = {
                        ...config.request,
                        pageIndex: this.pageIndex,
                        ...requestParam,
                    };
                }

                const response: BaseResponse<Array<RESPONSE_TYPE>> = await this.onAction(
                    false,
                    config.service,
                    request
                );
                this.handleMessageErrorByStatus(response);
                if (response.status) {
                    callback(response.data || []);
                    this.cdr.detectChanges();
                }
            },
            500
        );
    }

    protected onEnterDate(event: any) {
        event.preventDefault();
    }
}
