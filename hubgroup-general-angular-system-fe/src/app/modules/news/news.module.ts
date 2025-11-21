import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentShareModule } from 'src/app/shared/components/component-share.module';
import { NewsListComponent } from './news-list/news-list.component';
import { NewsAddOrChangeBaseComponent } from './news-add-or-change/news-add-or-change-base.component';
import { SharedModule } from '../../_metronic/shared/shared.module';
import { NewsSharedModule } from './components/news-shared.module';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzAffixComponent } from 'ng-zorro-antd/affix';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NgbCollapse, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { NewsAddOrChangeNormalComponent } from './news-add-or-change/news-add-or-change-normal/news-add-or-change-normal.component';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { CustomDirectiveModule } from '../../shared/directive/custom-directive.module';
import { TinyMceWrapperModule } from '../../shared/components/tinymce/tinymce.module';
import { CdkDrag, CdkDragHandle, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { NzSwitchComponent } from 'ng-zorro-antd/switch';
import { NzTabComponent, NzTabSetComponent } from 'ng-zorro-antd/tabs';
import { CustomPipeModule } from '../../shared/pipe/custom-pipe.module';
import { NewsOptionEnum } from '@hubgroup-share-system-fe/enums/news.enum';

@NgModule({
    declarations: [NewsListComponent, NewsAddOrChangeBaseComponent, NewsAddOrChangeNormalComponent],
    exports: [NewsListComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: NewsListComponent,
                pathMatch: 'full',
            },
            {
                path: 'current-user',
                component: NewsListComponent,
                data: {
                    isGetByCurrentUser: true,
                },
            },
            {
                path: 'option/2',
                component: NewsListComponent,
                data: {
                    isFAQ: true,
                },
            },
            {
                path: 'option/:options',
                component: NewsListComponent,
            },
            // {
            //     path: 'sort-type/:sortType/sort-field/:sortField',
            //     component: NewsListComponent,
            // },
            // {
            //     path: 'status/:status',
            //     component: NewsListComponent,
            // },

            {
                path: 'add/:displayType',
                component: NewsAddOrChangeBaseComponent,
            },
            {
                path: 'add-faq/:displayType',
                component: NewsAddOrChangeBaseComponent,
                data: {
                    isFAQ: true,
                },
            },
            {
                path: 'change/:articleId/:displayType',
                component: NewsAddOrChangeBaseComponent,
            },
            {
                path: 'change-faq/:articleId/:displayType',
                component: NewsAddOrChangeBaseComponent,
                data: {
                    isFAQ: true,
                },
            },
        ]),
        ComponentShareModule,
        SharedModule,
        NewsSharedModule,
        NzFlexDirective,
        NzAffixComponent,
        NzDividerComponent,
        NgbCollapse,
        NzTypographyComponent,
        NzPaginationComponent,
        CustomDirectiveModule,
        TinyMceWrapperModule,
        NzSwitchComponent,
        CdkDropList,
        CdkDrag,
        NzTabSetComponent,
        NzTabComponent,
        CdkDragPlaceholder,
        CdkDragHandle,
        CustomPipeModule,
        NzDropDownModule,
        NgbTimepicker,
    ],
    providers: [],
})
export class NewsModule {
    public static getComponent() {
        return NewsListComponent;
    }
}
