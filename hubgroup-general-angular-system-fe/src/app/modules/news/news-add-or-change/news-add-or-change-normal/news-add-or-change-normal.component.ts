import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from 'src/app/shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NewsBaseComponent } from '../../../../shared/base-components/news-base.component';
import {
    NEWS_DETAIL_VALIDATE,
    NEWS_VALIDATE_MESSAGE,
} from '../../../../shared/constant/news.constant';
import {
    NewsDetectChangeType,
    NewsOnlineAddOrChangeModelClient,
} from '@hubgroup-share-system-fe/types/news-online-client.type';
import { AngularSharedService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-news-add-or-change-normal',
    templateUrl: './news-add-or-change-normal.component.html',
})
export class NewsAddOrChangeNormalComponent extends NewsBaseComponent implements OnInit, OnDestroy {
    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    protected readonly NEWS_VALIDATE_MESSAGE = NEWS_VALIDATE_MESSAGE;
    protected readonly NEWS_DETAIL_VALIDATE = NEWS_DETAIL_VALIDATE;

    @Input() newsModel: Partial<NewsOnlineAddOrChangeModelClient> = {};
    @Input() isTypeQuestionAndAnswer: boolean = false;
    @Output() detectDataChangeFunc = new EventEmitter<NewsDetectChangeType>();

    @Output() isTemplatePodcastNotificationDisplayedChange = new EventEmitter<boolean>();

    async ngOnInit() {}

    async ngOnDestroy() {
        super.ngOnDestroy();
    }

    detectDataItemChange(data?: any) {
        this.detectDataChangeFunc.emit({ isChange: true, data });
    }
}
