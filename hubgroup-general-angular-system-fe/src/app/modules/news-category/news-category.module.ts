import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsCategoryComponent } from './news-category.component';
import { FormsModule } from '@angular/forms';
import { NewsCategoryAddOrChangeComponent } from './news-category-add-or-change/news-category-add-or-change.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NewsCategorySeoComponent } from './news-category-seo/news-category-seo.component';
import { ComponentShareModule } from '../../shared/components/component-share.module';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzAffixComponent } from 'ng-zorro-antd/affix';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { SharedModule } from '../../_metronic/shared/shared.module';
import { NzSwitchComponent } from 'ng-zorro-antd/switch';


@NgModule({
    declarations: [
        NewsCategoryComponent,
        NewsCategoryAddOrChangeComponent,
        NewsCategorySeoComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: NewsCategoryComponent,
            },
        ]),
        ComponentShareModule,
        DragDropModule,
        NzTreeModule,
        NzAffixComponent,
        NzFlexDirective,
        SharedModule,
        NzSwitchComponent,
    ],
})
export class NewsCategoryModule {
}
