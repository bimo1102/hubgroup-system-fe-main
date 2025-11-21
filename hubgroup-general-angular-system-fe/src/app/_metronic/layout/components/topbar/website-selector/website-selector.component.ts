import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/modules/auth';
import { ModuleBaseComponent } from '../../../../../shared/base-components/module-base-component';
import { CommonService } from 'src/app/shared/common.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { KeyValueTypeStringModel } from '@hubgroup-share-system-fe/types/common.type';
import { Observable } from 'rxjs';
import { WebsiteGetByIdRequest } from '@hubgroup-share-system-fe/types/website.type';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-website-selector',
    templateUrl: './website-selector.component.html',
})
export class WebsiteSelectorComponent extends ModuleBaseComponent implements OnInit {
    // @HostBinding('class')
    // class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
    // @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

    userAvatarClass: string = '';

    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        messageService: NzMessageService,
        modalService: NzModalService,
        angularSharedService: AngularSharedService,
        private authenticationService: AuthenticationService,
        private angularAuthService: AngularAuthService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    currentUser$: Observable<any>;

    ngOnInit() {
        this.currentUser$ = this.angularAuthService.currentUser$;
    }

    async onSelect(websiteSelected: KeyValueTypeStringModel) {
        const response = await this.onAction(
            true,
            this.authenticationService.websiteSelected.bind(this.authenticationService),
            { websiteId: websiteSelected.id }
        );
        this.handleMessageErrorByStatus(response);
        if (response.status) {
            const request: WebsiteGetByIdRequest = {
                id: websiteSelected.id,
            };
            const responseWebsiteById = await this.onAction(
                true,
                this.authenticationService.getWebsiteById.bind(this.authenticationService),
                request
            );
            if (responseWebsiteById.status && responseWebsiteById.data?.website?.ext) {
                window.location = responseWebsiteById.data.website.ext;
            }
        }
    }
}
