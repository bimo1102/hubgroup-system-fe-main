import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentShareModule } from 'src/app/shared/components/component-share.module';
import { SharedModule } from '../../../_metronic/shared/shared.module';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzAffixComponent } from 'ng-zorro-antd/affix';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzProgressComponent } from 'ng-zorro-antd/progress';
import { TinyMceWrapperModule } from '../../../shared/components/tinymce/tinymce.module';
import {
    NewsAddOrChangeThumbImageComponent,
} from './news-add-or-change-thumb-image/news-add-or-change-thumb-image.component';
import { NewsSubCategoryComponent } from './news-sub-category/news-sub-category.component';
import { NewsSubCategoryItemComponent } from './news-sub-category/news-sub-category-item.component';
import { NewsMainCategoryComponent } from './news-main-category/news-main-category.component';
import { NewsArticleRelatedComponent } from './news-article-related/news-article-related.component';
import { CdkDrag, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { CustomDirectiveModule } from '../../../shared/directive/custom-directive.module';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NzSwitchComponent } from 'ng-zorro-antd/switch';
import { CustomPipeModule } from '../../../shared/pipe/custom-pipe.module';

@NgModule({
    declarations: [
        NewsAddOrChangeThumbImageComponent,
        NewsSubCategoryComponent,
        NewsSubCategoryItemComponent,
        NewsMainCategoryComponent,
        NewsArticleRelatedComponent,
    ],
    exports: [
        NewsAddOrChangeThumbImageComponent,
        NewsSubCategoryComponent,
        NewsSubCategoryItemComponent,
        NewsMainCategoryComponent,
        NewsArticleRelatedComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([]),
        ComponentShareModule,
        SharedModule,
        NzFlexDirective,
        NzAffixComponent,
        NzDividerComponent,
        NzProgressComponent,
        TinyMceWrapperModule,
        CdkDrag,
        CdkDropList,
        CdkDragPlaceholder,
        CustomDirectiveModule,
        NgbCollapse,
        NzSwitchComponent,
        CustomPipeModule,
    ],
})
export class NewsSharedModule {
}
