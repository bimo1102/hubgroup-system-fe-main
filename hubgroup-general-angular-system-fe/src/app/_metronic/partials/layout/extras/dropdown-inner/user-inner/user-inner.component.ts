import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
import { AuthService } from '../../../../../../modules/auth';
import { CommonService } from '../../../../../../shared/common.service';
import { AuthenticationService } from '../../../../../../shared/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModuleBaseComponent } from '../../../../../../shared/base-components/module-base-component';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';
import { LanguageService } from '../../../../../../shared/services/language.service';

@Component({
    selector: 'app-user-inner',
    templateUrl: './user-inner.component.html',
})
export class UserInnerComponent extends ModuleBaseComponent implements OnInit, OnDestroy {
    @HostBinding('class')
    class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
    @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

    language: any = {};
    user$: Observable<any>;
    languages: any = [];

    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private auth: AuthService,
        private translationService: TranslationService,
        private authenticationService: AuthenticationService,
        private angularAuthService: AngularAuthService,
        private languageService: LanguageService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    async ngOnInit() {
        this.user$ = this.angularAuthService.currentUser$;
        this.languages = this.languageService.languagesValue;
        if (this.languages?.length > 0) {
            for (let item of this.languages) {
                if (item.active) {
                    this.language = item;
                }
            }
        }
    }

    async logout() {
        await this.auth.logout();
        document.location.reload();
    }

    selectLanguage(lang: string) {
        this.translationService.setLanguage(lang);
        this.setLanguage(lang);
    }

    setLanguage(lang: string) {
        this.languages.forEach((language: any) => {
            if (language.lang === lang) {
                language.active = true;
                this.language = language;
            } else {
                language.active = false;
            }
        });
        this.languageService.languagesValue = this.languages;
    }

    async onReloadPermission() {
        const response: BaseResponse<null> = await this.onAction(
            true,
            this.authenticationService.reloadUserPermission.bind(this.authenticationService),
            {}
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            this.showMessageSuccess(this.translate.instant('Success'));
            window.location.reload();
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
