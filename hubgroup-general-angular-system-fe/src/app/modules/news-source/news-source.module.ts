import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsSourceComponent } from './news-source.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewsSourceAddOrChangeComponent } from './news-source-add-or-change/news-source-add-or-change.component';
import { ComponentShareModule } from '../../shared/components/component-share.module';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzAffixComponent } from 'ng-zorro-antd/affix';
import { CustomDirectiveModule } from '../../shared/directive/custom-directive.module';

@NgModule({
    declarations: [
        NewsSourceComponent,
        NewsSourceAddOrChangeComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: NewsSourceComponent,
            },
        ]),
        ComponentShareModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        NzFlexDirective,
        NzAffixComponent,
        CustomDirectiveModule,
    ],
    providers: [],
})

export class NewsSourceModule {
}
