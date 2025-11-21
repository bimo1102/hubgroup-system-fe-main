import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModuleBaseComponent } from '../../../../../shared/base-components/module-base-component';
import { CommonService } from 'src/app/shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AngularAuthService, AngularSharedService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-application-selector',
    templateUrl: './application-selector.component.html',
})

export class ApplicationSelectorComponent extends ModuleBaseComponent implements OnInit {
    // @HostBinding('class')
    // class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
    // @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

    userAvatarClass: string = 'symbol-35px symbol-md-40px';
    currentWebsiteDomain: string = '';

    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        messageService: NzMessageService,
        modalService: NzModalService,
        angularSharedService: AngularSharedService,
        private angularAuthService: AngularAuthService,
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    ngOnInit() {
        this.currentWebsiteDomain = this.angularAuthService.currentUserValue?.website?.ext;
    }

    async onSelect(website: any) {
    }
}
