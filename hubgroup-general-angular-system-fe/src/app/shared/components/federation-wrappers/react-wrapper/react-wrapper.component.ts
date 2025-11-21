import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { environment } from 'src/environments/environment';
import StatusResponseEnum from '@hubgroup-share-system-fe/enums/status-response.enum';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';
import { loadRemoteModule } from '@hubgroup-share-system-fe/utils/federation-utils';
import {
    FederationAppInitProps,
    FederationDataObservableType,
} from '@hubgroup-share-system-fe/types/federation.type';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DataObservableTypeEnum } from '@hubgroup-share-system-fe/enums/federation.enum';
import { ModuleBaseComponent } from 'src/app/shared/base-components/module-base-component';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-react-wrapper',
    templateUrl: './react-wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './react-wrapper.component.scss',
})
export class ReactWrapperComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    private root: Root;
    protected isLoadingModule: boolean = false;
    @ViewChild('react_app', { read: ElementRef, static: true }) elementRef: ElementRef;
    @Input({
        alias: 'moduleName',
        required: true,
    })
    moduleName: string;
    @Input() props: FederationAppInitProps;
    @Input() isModalMode: boolean = false;

    dataSubject = new BehaviorSubject<FederationDataObservableType | null>(null);
    data$ = this.dataSubject.asObservable();
    unsubscription: Array<Subscription> = [];

    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private router: Router,
        private angularAuthService: AngularAuthService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    async ngOnInit() {
        const subscription = this.angularAuthService.currentUser$.subscribe((user) => {
            this.dataSubject.next({
                type: DataObservableTypeEnum.ChangeUser,
                data: user,
            });
        });
        this.unsubscription.push(subscription);
        const subscriptionLanguage = this.angularSharedService.languageSelected.subscribe(
            (language) => {
                this.dataSubject.next({
                    type: DataObservableTypeEnum.ChangeLanguage,
                    data: language,
                });
            }
        );
        this.unsubscription.push(subscriptionLanguage);
        await this.onRenderComponents();
    }

    ngOnDestroy() {
        this.unsubscription.forEach((unsubscribe) => unsubscribe.unsubscribe());
        if (this.root) {
            this.root.unmount();
        }
    }

    protected async onRenderComponents() {
        if (!this.elementRef.nativeElement) return;
        if (!this.moduleName || this.moduleName?.length == 0) return;
        const splitModuleName = this.moduleName.split('/');
        const remoteEntry = `${splitModuleName[0]}Url`;
        const requestModule = {
            exposedModule: `./${splitModuleName[1]}`,
            remoteEntry: (environment[remoteEntry as keyof typeof environment] +
                '/remoteEntry.js') as string,
            remoteName: splitModuleName[0],
        };
        const moduleLocaleKey: string = `${splitModuleName[0]}_${this.angularSharedService.languageSelected.value}`;
        const propsData: FederationAppInitProps = {
            ...this.props,
            currentUser: this.angularAuthService.currentUserValue,
            currentLanguageSelected: this.angularSharedService.languageSelected.value,
            localeResources: this.angularSharedService.locales[moduleLocaleKey],
            moduleLocaleKey: moduleLocaleKey,
            updateLocale: this.updateLocale.bind(this),
            navigate: this.router.navigate.bind(this),
            updateResponseStatus: this.updateResponseStatus.bind(this),
            showFileManagerDialog: this.showFileManagerDialog.bind(this),
            data$: this.data$ as any,
            disableGlobalStylesInReactMFE: true,
        };
        // console.log(propsData);
        try {
            this.isLoadingModule = true;
            // console.log(requestModule);
            const module = await loadRemoteModule(requestModule);
            const reactElement = createElement(module.default, propsData);
            this.root = createRoot(this.elementRef.nativeElement);
            this.root.render(reactElement);
            this.isLoadingModule = false;
        } catch (error) {
            this.isLoadingModule = false;
            console.log('Load ReactModule Error: ', error);
        }
        this.cdr.markForCheck();
    }

    updateLocale(moduleLocaleKey: string, locale: any) {
        this.angularSharedService.locales[moduleLocaleKey] = locale;
    }

    updateResponseStatus(status: StatusResponseEnum, callBackFunc?: Function) {
        // @ts-ignore
        this.angularSharedService.currentResponseStatus = status;
    }
}
