import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { ModuleBaseComponent } from './shared/base-components/module-base-component';
import { CommonService } from './shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { SignalRService } from './shared/services/signalr.service';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { AuthService } from './modules/auth';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LanguageService } from './shared/services/language.service';
import { AuthReloadEnum, BreakpointEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';
import HttpStatusCodeEnum from '@hubgroup-share-system-fe/enums/status-response.enum';

@Component({
    // tslint:disable-next-line:component-selector
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'body[root]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends ModuleBaseComponent implements OnInit {
    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private signalrService: SignalRService,
        private router: Router,
        private languageService: LanguageService,
        private modeService: ThemeModeService,
        private breakpointObserver: BreakpointObserver,
        private authService: AuthService,
        private angularAuthService: AngularAuthService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
        this.handleLocalStorageAuthInitAndAfterCloseDialog();

        this.commonService.reloadStatus$.subscribe(async (value) => {
            if (value === AuthReloadEnum.ReloadGetUserByToken) {
                await this.authService.getUserByToken(true);
            } else if (value === AuthReloadEnum.ReloadLoginProcess) {
                await this.loginProcess();
            } else if (
                value === AuthReloadEnum.End &&
                this.angularSharedService.callbackAfterAuthentication.length > 0
            ) {
                this.angularSharedService.callbackAfterAuthentication.forEach((callback) => {
                    callback();
                });
                this.angularSharedService.callbackAfterAuthentication = [];
            }
        });

        const subscriptionResponseStatus = this.angularSharedService.responseStatus$.subscribe(
            (status) => {
                if (status === HttpStatusCodeEnum.UNAUTHORIZED) {
                    this.showLoginDialog();
                }
            }
        );
        this.unsubscribe.push(subscriptionResponseStatus);
    }

    async ngOnInit() {
        const breakpointSubscribe = this.breakpointObserver
            .observe([
                BreakpointEnum.XXlAnt,
                BreakpointEnum.XXl,
                BreakpointEnum.Xl,
                BreakpointEnum.Desktop,
                BreakpointEnum.Lg,
                BreakpointEnum.MaxMd,
                BreakpointEnum.Md,
                BreakpointEnum.Sm,
                BreakpointEnum.Xs,
            ])
            .subscribe((result) => {
                const currentBreakpoints = Object.keys(result.breakpoints).filter(
                    (key) => result.breakpoints[key]
                );
                if (currentBreakpoints) {
                    this.angularSharedService.screenSize$.next(
                        currentBreakpoints as Array<BreakpointEnum>
                    );
                    this.angularSharedService.isDesktop$.next(
                        currentBreakpoints.includes(BreakpointEnum.Desktop)
                    );
                    this.angularSharedService.isMobile$.next(
                        !currentBreakpoints.includes(BreakpointEnum.MaxMd)
                    );
                    this.cdr.detectChanges();
                }
            });
        this.unsubscribe.push(breakpointSubscribe);

        // this.userBehavior();

        this.signalrService.onInit();
        this.modeService.init();
        await this.loginProcess();
        // Promise.all([this.signalrService.onConnect(), this.loginProcess()]).then();

        const subscription = this.router.events.subscribe((event) => {
            if (event instanceof RouteConfigLoadStart) {
                this.setLoading(true);
            } else if (event instanceof RouteConfigLoadEnd) {
                this.unSetLoading();
            }
        });
        this.unsubscribe.push(subscription);

        // const subscribe = combineLatest([this.angularSharedService.currentUser$, this.commonService.responseStatus$]).subscribe(
        //     ([user, responseStatus]) => {
        //         if (!isEmpty(user) && !user.isNeedOtpVerify && user.token && responseStatus !== StatusResponseEnum.UNAUTHORIZED) {
        //         }
        //     });

        // this.unsubscribe.push(subscribe);
    }

    async loginProcess() {
        await this.languageService.initLanguage();

        const user = this.angularAuthService.currentUserValue;
        if (!user) {
            this.showLoginDialog();
            return;
        } else if (user.isNeedOtpVerify) {
            this.showOTPDialog();
            return;
        }

        this.commonService.currentReloadValue = AuthReloadEnum.End;
        const url = this.router.url;
        if (url.startsWith('/auth/login')) {
            await this.router.navigate(['/dashboard']);
        }
    }
}
