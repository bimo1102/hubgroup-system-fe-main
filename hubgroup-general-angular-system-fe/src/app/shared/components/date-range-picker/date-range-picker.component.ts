import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModuleBaseComponent } from '../../base-components/module-base-component';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { AngularSharedService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-news-date-range-picker',
    templateUrl: './date-range-picker.component.html',
})
export class DateRangePickerComponent extends ModuleBaseComponent implements OnInit {

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

    @Input() placeHolder: Array<string> = [this.translate.instant('choose.date.start'), this.translate.instant('choose.date.end')];
    @Input() disable: boolean = false;
    @Input() showTime: boolean = false;
    @Input() format: string = this.dateTimeFormat;

    @Input() date?: Array<Date | any> = [];
    @Output() dateChange = new EventEmitter<Date[]>();

    @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

    ngOnInit() {
    }

    onDateChange(date: Array<Date>) {
        this.dateChange.emit(date);
    }

    disabledStartDate = (startValue: Date): boolean => {
        return false
        //
        // if (!startValue || (this.date && !this.date[1])) {
        //     return false;
        // }
        // return startValue.getTime() > this.date![1].getTime();
    };

    disabledEndDate = (endValue: Date): boolean => {
        return false
        // if (!endValue || (this.date && !this.date[0])) {
        //     return false;
        // }
        // return endValue.getTime() <= this.date![0].getTime();
    };

    handleStartOpenChange(open: boolean): void {
        if (!open) {
            this.endDatePicker.open();
        }
    }

    // handleEndOpenChange(open: boolean): void {
    //     console.log('handleEndOpenChange', open);
    // }
}
