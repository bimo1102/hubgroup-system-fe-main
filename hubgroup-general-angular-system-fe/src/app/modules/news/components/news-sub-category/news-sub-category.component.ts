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
import { KeyValueTypeLongModel } from '@hubgroup-share-system-fe/types/common.type';
import { NewsDisplayTypeEnum, NewsOptionEnum } from '@hubgroup-share-system-fe/enums/news.enum';
import { AngularSharedService } from 'nexussoft-angular-shared';
import { CategoryMappingModel } from '@hubgroup-share-system-fe/types/news-category.type';

@Component({
    selector: 'app-news-sub-category',
    templateUrl: './news-sub-category.component.html',
})
export class NewsSubCategoryComponent extends NewsBaseComponent implements OnInit, OnDestroy {
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

    @Input() layout: 'horizontal' | 'vertical' = 'horizontal';
    @Input() websiteId: string = '';
    @Input() isMultipleWebsite: boolean = false;

    @Input() newsDisplayType?: NewsDisplayTypeEnum;

    @Input() prOption: Partial<KeyValueTypeLongModel<NewsOptionEnum>> = {};

    @Output() detectDataChangeFunc = new EventEmitter<NewsDetectChangeType>();

    ngOnInit() {}

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    onAddSubCategory() {
        this.categorySubs!.push({});
    }

    async onSelectSubCategory({
        categoryId: subcategoryId,
        category: categoryMappingModel,
    }: {
        categoryId: string;
        category: CategoryMappingModel;
    }) {
        let valid = true;
        let keyMessage;
        if (this.categoryMain?.categoryId === subcategoryId) {
            keyMessage = 'sub.category.duplicate.main.category';
            valid = false;
        }

        const isSubCategoryDuplicate =
            valid &&
            subcategoryId &&
            this.categorySubs?.some((item) => item.categoryId === subcategoryId);
        if (isSubCategoryDuplicate) {
            keyMessage = 'sub.category.duplicate.sub.category';
            valid = false;
        }

        if (valid) {
            categoryMappingModel.categoryId = subcategoryId;
        } else {
            categoryMappingModel.categoryId =
                categoryMappingModel.categoryId === undefined ? '' : undefined;
            if (keyMessage) this.showMessageWarning(this.translate.instant(keyMessage));

            return;
        }
    }

    onRemoveCategorySub(index: number) {
        this.categorySubs.splice(index, 1);
        this.detectDataItemChange();
    }

    detectDataSubCategoryChange(data?: any) {
        this.detectDataItemChange(data);
    }

    detectDataItemChange(data?: any) {
        this.detectDataChangeFunc.emit({ isChange: true, data });
    }
}
