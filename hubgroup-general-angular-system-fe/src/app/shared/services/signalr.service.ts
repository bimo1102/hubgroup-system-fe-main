import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { Dictionary } from '../dictionary';
import {
    ConnectionStringEnum,
    SignalStatusEnum,
} from '@hubgroup-share-system-fe/enums/signal-message.enum';
import { AngularEnvironmentService } from 'nexussoft-angular-shared';

@Injectable({ providedIn: 'root' })
export class SignalRService {
    private connection: signalR.HubConnection;
    private isInit: boolean;
    public status = SignalStatusEnum.Close;
    private onConnectSubscribe = new Subject<{ key: ConnectionStringEnum; value: any }>();
    onConnectSubscribe$ = this.onConnectSubscribe.asObservable();
    processFunction = new Dictionary<any>();

    constructor(private angularEnvironmentService: AngularEnvironmentService) {}

    private isRegisterOnProcess = false;

    onInit() {
        if (!this.angularEnvironmentService.environment.notifiesUrl) return;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(this.angularEnvironmentService.environment.notifiesUrl)
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: (retryContext) => {
                    console.log(retryContext);
                    const time = 10000;
                    const today = new Date();
                    console.log(today);
                    return time;
                },
            })
            .build();
    }

    public async onConnect() {
        if (this.isInit) {
            return;
        }
        console.log('AngularSignalrService onConnect 1');
        try {
            this.connection.onreconnecting((error) => {
                console.log('AngularSignalrService onReconnecting');
                this.status = SignalStatusEnum.ReConnecting;
                this.onConnectSubscribe.next({
                    key: ConnectionStringEnum.OnReconnecting,
                    value: '',
                });
            });
            this.connection.onreconnected((connectionId) => {
                console.log('AngularSignalrService onReconnected ' + connectionId);
                this.status = SignalStatusEnum.ReConnected;
                this.onConnectSubscribe.next({
                    key: ConnectionStringEnum.OnReconnected,
                    value: '',
                });
            });
            this.connection.onclose((error) => {
                console.log('AngularSignalrService onclose');
                this.status = SignalStatusEnum.Close;
                this.isInit = false;
                this.onConnectSubscribe.next({ key: ConnectionStringEnum.Onclose, value: '' });
            });
            this.connection.on('OnLoginSuccess', (message) => {
                console.log('AngularSignalrService OnLoginSuccess');
                this.status = SignalStatusEnum.LoginSuccess;
                this.onConnectSubscribe.next({
                    key: ConnectionStringEnum.OnLoginSuccess,
                    value: message,
                });
            });
            this.connection.on('OnLoginWarning', (message) => {
                console.log('OnLoginWarning' + message);
            });

            this.connection.start().then(() => {
                this.status = SignalStatusEnum.Success;
                this.onConnectSubscribe.next({
                    key: ConnectionStringEnum.OnConnected,
                    value: 'success',
                });
                this.isInit = true;
            });
        } catch (err) {
            console.log('AngularSignalrService catch (err)');
            this.onConnectSubscribe.next({ key: ConnectionStringEnum.Onclose, value: err });
            this.status = SignalStatusEnum.CrackClose;
            console.log(err);
        }
    }

    public onProcess(method: any, func: any, key: any) {
        console.log(this.processFunction.containsKey(key));
        if (this.processFunction.containsKey(key)) {
            this.processFunction.remove(key);
            //return;
        }
        this.processFunction.add(key, func);
        if (!this.isRegisterOnProcess) {
            this.isRegisterOnProcess = true;
            if (this.connection) {
                this.connection.on(method, (message: any) => {
                    const events = this.processFunction.values();
                    if (events?.length > 0) {
                        for (const func of events) {
                            func(message);
                        }
                    }
                    //func(message);
                });
            }
        }
    }

    public async onReLoginSignal(sessionId: string) {
        await this.onSend('OnReLogin', sessionId);
    }

    public onEndProcess(key: any) {
        if (this.processFunction.containsKey(key)) {
            this.processFunction.remove(key);
        }
    }

    private async onSend(method: any, message: any) {
        try {
            await this.connection.send(method, message);
            // await this.connection.invoke(method, message);
        } catch (err) {
            console.log(err);
        }
    }

    public getConnectionId(): string {
        return this.connection.connectionId != null ? this.connection.connectionId : '';
    }

    public async disconnect() {
        await this.connection.stop();
    }

    public async onLockAction(action: any) {
        await this.onSend('onLockAction', action);
    }

    public async onNewsHistoryAdd(action: any) {
        await this.onSend('OnNewsHistoryAdd', action);
    }

    public async JoinToGroup(key: any) {
        await this.onJoinToGroup(key, 0);
    }

    private async onJoinToGroup(key: any, deep: number) {
        deep++;
        if (deep > 10) {
            return;
        }
        if (
            this.status === SignalStatusEnum.LoginSuccess ||
            this.status === SignalStatusEnum.Success
        ) {
            await this.onSend('JoinToGroup', key);
        } else {
            const $this = this;
            setTimeout(() => {
                $this.onJoinToGroup(key, deep);
            }, 200);
        }
    }

    public async LeaveFromGroup(key: any) {
        await this.onSend('LeaveFromGroup', key);
    }
}
