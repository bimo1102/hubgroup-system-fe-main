import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModuleBaseComponent } from '../../base-components/module-base-component';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularSharedService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-news-date-picker',
    templateUrl: './date-picker.component.html',
})
export class DatePickerComponent extends ModuleBaseComponent implements OnInit {

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

    @Input() placeHolder: string = '';
    @Input() date?: string | Date;

    @Input() format: string = this.dateTimeFormat;
    @Input() showTime: boolean = false;

    @Output() dateChange = new EventEmitter<string | Date>();

    ngOnInit() {
    }

    onChangeDatePicker(date: Date | string) {
        this.dateChange.emit(date);
    }
}
