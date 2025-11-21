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
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NewsBaseComponent } from '../../../../shared/base-components/news-base.component';
import { CommonService } from '../../../../shared/common.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NewsRelatedModalComponent } from '../../../../shared/components/news-related-modal/news-related-modal.component';
import { NewsStatusEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import { RelatedNewsModel } from '@hubgroup-share-system-fe/types/news-online.type';
import { NewsDetectChangeType } from '@hubgroup-share-system-fe/types/news-online-client.type';
import { NewsSimpleModel } from '@hubgroup-share-system-fe/types/news.type';
import { AngularSharedService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-news-article-related',
    templateUrl: './news-article-related.component.html',
})
export class NewsArticleRelatedComponent extends NewsBaseComponent implements OnInit, OnDestroy {
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

    protected readonly NewsStatusEnum = NewsStatusEnum;

    @Input() editable: boolean = true;

    @Input() relatedArticles: Array<RelatedNewsModel> = [];
    @Output() relatedArticlesChange = new EventEmitter<Array<RelatedNewsModel>>();

    @Input() isMultipleWebsite: boolean = false;
    @Input() websiteId: string = '';

    @Output() detectDataChangeFunc = new EventEmitter<NewsDetectChangeType>();

    async ngOnInit() {}

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    onOpenRelatedModal() {
        this.onShowDialogModalMedium(
            '',
            NewsRelatedModalComponent,
            {},
            {
                relatedArticles: this.relatedArticles,
                isMultipleWebsite: this.isMultipleWebsite,
                websiteId: this.websiteId,
                onChangeRelated: this.onChangeRelated.bind(this),
            },
            () => {}
        );
    }

    onChangeRelated(item: NewsSimpleModel, checked: boolean) {
        if (checked) {
            this.relatedArticles!.push({ ...item, priority: 0 });
        } else {
            const relatedArticlesFilter = this.relatedArticles!.filter(
                (itemFilter) => itemFilter.id !== item.id
            );
            this.relatedArticlesChange.emit(relatedArticlesFilter);
        }
        this.detectDataItemChange();
    }

    onDropRelatedNews(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.relatedArticles!, event.previousIndex, event.currentIndex);
        this.detectDataItemChange();
    }

    onRemoveRelatedNews(index: number) {
        this.relatedArticles!.splice(index, 1);
    }

    detectDataItemChange(data?: any) {
        this.detectDataChangeFunc.emit({ isChange: true, data });
    }
}
