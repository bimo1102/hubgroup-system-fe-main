import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SignalRService } from './signalr.service';
import { TytHttpClient } from '../tyt-http-client.service';
import {
    ActivityEndRequest,
    ActivityGetCurrentUserRequest,
    ActivityStartRequest,
    CurrentUserActivityModel,
    InitSignalMessageType,
    SignalMessageResponse,
    SignalMessageType,
} from '@hubgroup-share-system-fe/types/signal-message.type';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';
import {
    ConnectionStringEnum,
    NotifyActionTypeEnum,
    SignalStatusEnum,
    UserActivityTypeEnum,
} from '@hubgroup-share-system-fe/enums/signal-message.enum';
import { AngularEnvironmentService } from 'nexussoft-angular-shared';

@Injectable({ providedIn: 'root' })
export class SignalMessageService implements OnDestroy {
    constructor(
        private http: TytHttpClient,
        private signalRService: SignalRService,
        private angularEnvironmentService: AngularEnvironmentService
    ) {
        this.baseUrl = this.angularEnvironmentService.environment.apiRmsUrl || '';
    }

    baseUrl = '';
    private readonly unsubscribe: Array<Subscription> = [];
    private readonly PROCESS_KEY = 'user.signal.editor.success';

    initValue: InitSignalMessageType;

    signalMessageBehaviorSubject$ = new BehaviorSubject<Partial<SignalMessageType> | null>(null);
    currentUserConnection$ = new BehaviorSubject<Array<CurrentUserActivityModel>>([]);
    isProcessing = false;
    sessionId: string = '';
    onAction: (
        isCheckLoading: boolean,
        func: any,
        params: any,
        options?: { keepParams: boolean }
    ) => Promise<any>;

    async ngOnDestroy() {
        await this.onDestroy();
    }

    private activityStart(request: ActivityStartRequest): Promise<BaseResponse<string>> {
        return this.http.post(this.baseUrl + '/ConnectionMessage/ActivityStart', request);
    }

    private activityEnd(request: ActivityEndRequest): Promise<BaseResponse<null>> {
        return this.http.post(this.baseUrl + '/ConnectionMessage/ActivityEnd', request);
    }

    private activityGetCurrentUser(
        request: ActivityGetCurrentUserRequest
    ): Promise<BaseResponse<Array<CurrentUserActivityModel>>> {
        return this.http.post(this.baseUrl + '/ConnectionMessage/ActivityGetCurrentUser', request);
    }

    async onInit(
        initValue: InitSignalMessageType,
        onAction: (
            isCheckLoading: boolean,
            func: any,
            params: any,
            options?: {
                keepParams: boolean;
            }
        ) => Promise<any>
    ) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        this.onAction = onAction;
        this.initValue = initValue;

        console.log('this.signalRService.status', this.signalRService.status);
        if (
            this.signalRService.status === SignalStatusEnum.LoginSuccess ||
            this.signalRService.status === SignalStatusEnum.Success
        ) {
            this.signalMessageBehaviorSubject$.next({
                ...this.signalMessageBehaviorSubject$.value,
                status: this.signalRService.status,
            });
            this.initListenMessage();
            await this.initActivity();
        }

        const subscribe = this.signalRService.onConnectSubscribe$.subscribe((obj) => {
            this.signalMessageBehaviorSubject$.next({
                ...this.signalMessageBehaviorSubject$.value,
                status: this.signalRService.status,
            });
            if (
                obj.key === ConnectionStringEnum.OnLoginSuccess ||
                obj.key === ConnectionStringEnum.OnReconnected
            ) {
                this.initListenMessage();
                this.initActivity();
            }
        });
        this.unsubscribe.push(subscribe);
    }

    private initListenMessage() {
        this.signalRService.onProcess(
            'Notify',
            async (message: SignalMessageResponse) => {
                this.signalMessageBehaviorSubject$.next({
                    ...this.signalMessageBehaviorSubject$.value,
                    ...message,
                    actionType: message.actionType,
                    methodName: 'Notify',
                });
                if (
                    message.actionType === NotifyActionTypeEnum.UserActivityStart ||
                    message.actionType === NotifyActionTypeEnum.UserActivityEnd
                ) {
                    await this.getCurrentUserConnection();
                }
            },
            this.PROCESS_KEY
        );
    }

    private getKeySignalGroup() {
        return `UserActivityGroup_${this.initValue?.newsId || ''}_${UserActivityTypeEnum.Article}_${
            this.angularEnvironmentService.environment.clientWebsiteId
        }`;
    }

    private async initActivity() {
        this.signalRService.JoinToGroup(this.getKeySignalGroup()).then();
        const request: ActivityStartRequest = {
            socketId: this.signalRService.getConnectionId(),
            objectId: this.initValue?.newsId || '',
            type: UserActivityTypeEnum.Article,
            websiteId: this.angularEnvironmentService.environment.clientWebsiteId,
            url: location.href,
            arguments: '',
        };
        const response: BaseResponse<string> = await this.onAction(
            false,
            this.activityStart.bind(this),
            request
        );
        if (response.status && response.data) {
            this.sessionId = response.data;
            await this.getCurrentUserConnection();
        }
    }

    private async getCurrentUserConnection() {
        const request: ActivityGetCurrentUserRequest = {
            objectId: this.initValue?.newsId || '',
            type: UserActivityTypeEnum.Article,
            websiteId: this.angularEnvironmentService.environment.clientWebsiteId,
        };
        const response: BaseResponse<Array<CurrentUserActivityModel>> = await this.onAction(
            false,
            this.activityGetCurrentUser.bind(this),
            request
        );
        if (response.status) {
            this.currentUserConnection$.next(response.data);
        }
    }

    async onDestroy() {
        if (this.onAction) {
            await this.onAction(false, this.activityEnd.bind(this), { id: this.sessionId });
        }
        this.signalRService.onEndProcess(this.PROCESS_KEY);
        await this.signalRService.LeaveFromGroup(this.getKeySignalGroup());
        this.unsubscribe.forEach((sub) => sub.unsubscribe());
        this.isProcessing = false;
        console.log('ws disconnect group activity');
    }
}
