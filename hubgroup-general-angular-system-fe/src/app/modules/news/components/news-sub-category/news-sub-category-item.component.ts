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
import { NewsDetectChangeType } from '@hubgroup-share-system-fe/types/news-online-client.type';
import { isEmpty } from 'lodash';
import { KeyValueTypeLongModel } from '@hubgroup-share-system-fe/types/common.type';
import { NewsDisplayTypeEnum, NewsOptionEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import { Common } from 'src/app/shared/common';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { CategoryMappingModel } from '@hubgroup-share-system-fe/types/news-category.type';

@Component({
    selector: 'app-newspaper-sub-category-item',
    templateUrl: './news-sub-category-item.component.html',
})
export class NewsSubCategoryItemComponent extends NewsBaseComponent implements OnInit, OnDestroy {
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

    @Input() newsDisplayType?: NewsDisplayTypeEnum;

    @Input() subCategory: CategoryMappingModel;
    @Input() prOption: Partial<KeyValueTypeLongModel<NewsOptionEnum>> = {};

    @Output() selectSubCategoryFunc = new EventEmitter<{
        categoryId: string;
        category: CategoryMappingModel;
    }>();
    @Output() removeCategorySubFunc = new EventEmitter<void>();

    @Input() websiteId: string = '';

    @Output() detectDataChangeFunc = new EventEmitter<NewsDetectChangeType>();

    async ngOnInit() {
        if (this.sources.subCateSources.length === 0 && !isEmpty(this.subCategory)) {
            this.sources.subCateSources = Common.initSourcesAutoComplete(
                this.sources.subCateSources,
                [
                    {
                        id: this.subCategory.categoryId!,
                        value: this.subCategory.categoryId!,
                        text: this.subCategory.categoryName,
                        selected: true,
                        checked: true,
                        ext: '',
                    },
                ]
            );
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    onSelectSubCategory(categoryId: string) {
        this.selectSubCategoryFunc.emit({
            categoryId,
            category: this.subCategory,
        });
    }

    onSearchNewsCategoryAutocomplete(keyword: string) {
        this.requestSubCateAutocomplete$.next({
            keyword,
            displayType: this.newsDisplayType,
        });
    }

    onRemoveCategorySub() {
        this.removeCategorySubFunc.emit();
    }

    detectDataItemChange(data?: any) {
        this.detectDataChangeFunc.emit({ isChange: true, data });
    }
}
