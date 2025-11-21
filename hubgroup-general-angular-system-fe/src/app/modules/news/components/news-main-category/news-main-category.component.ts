import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NewsBaseComponent } from '../../../../shared/base-components/news-base.component';
import { CommonService } from '../../../../shared/common.service';
import {
    NewsDetectChangeType,
    ZonePositionModelClient,
} from '@hubgroup-share-system-fe/types/news-online-client.type';
import { ZoneOptionEnum } from '@hubgroup-share-system-fe/enums/zone.enum';
import { isEmpty } from 'lodash';
import { NewsDisplayTypeEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import { Common } from 'src/app/shared/common';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { CategoryMappingModel } from '@hubgroup-share-system-fe/types/news-category.type';

@Component({
    selector: 'app-news-main-category',
    templateUrl: './news-main-category.component.html',
})
export class NewsMainCategoryComponent
    extends NewsBaseComponent
    implements OnInit, OnChanges, OnDestroy
{
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

    @Input() editable: boolean = true;

    @Input() categoryMain: CategoryMappingModel = {};
    @Input() categorySubs: Array<CategoryMappingModel> = [];

    @Input() newsDisplayType?: NewsDisplayTypeEnum;

    @Input() layout: 'horizontal' | 'vertical' = 'horizontal';

    @Input() websiteId: string = '';
    @Input() isMultipleWebsite: boolean = false;

    @Output() detectDataChangeFunc = new EventEmitter<NewsDetectChangeType>();
    @Output() checkViewKpiDefaultConfigFunc = new EventEmitter<void>();

    async ngOnInit() {}

    ngOnChanges(_changes: SimpleChanges) {
        if (!isEmpty(this.categoryMain)) {
            this.sources.categoryMainSources = Common.initSourcesAutoComplete(
                this.sources.categoryMainSources,
                [
                    {
                        id: this.categoryMain!.categoryId || '',
                        value: this.categoryMain!.categoryId || '',
                        text: this.categoryMain!.categoryName || '',
                        checked: true,
                        selected: true,
                        ext: '',
                    },
                ]
            );
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    async onSelectMainCategory(categoryId: string, mainCategoryMappingModel: CategoryMappingModel) {
        const isCategoryExist =
            categoryId && this.categorySubs?.some((item) => item.categoryId === categoryId);
        if (isCategoryExist) {
            mainCategoryMappingModel.categoryId =
                mainCategoryMappingModel.categoryId === undefined ? '' : undefined;
            this.showMessageWarning(this.translate.instant('main.category.duplicate.sub.category'));
            return;
        } else {
            mainCategoryMappingModel.categoryId = categoryId;
        }
    }

    onSearchNewsCategoryAutocomplete(keyword: string) {
        if (this.isMultipleWebsite) {
            this.requestCategoryMultipleWebsiteAutocomplete$.next({
                keyword,
                websiteId: this.websiteId,
                displayType: this.newsDisplayType,
            });
        } else {
            this.requestCategoryMainAutocomplete$.next({
                keyword,
                displayType: this.newsDisplayType,
            });
        }
    }

    detectDataItemChange(data?: any) {
        this.detectDataChangeFunc.emit({ isChange: true, data });
    }
}
