import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModuleBaseComponent } from '../../shared/base-components/module-base-component';
import { AngularSharedService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent extends ModuleBaseComponent implements OnInit, OnDestroy {

    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    async ngOnInit() {

    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
