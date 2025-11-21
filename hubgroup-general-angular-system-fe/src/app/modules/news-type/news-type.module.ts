import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsTypeComponent } from './news-type.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewsTypeAddOrChangeComponent } from './news-type-add-or-change/news-type-add-or-change.component';
import { ComponentShareModule } from '../../shared/components/component-share.module';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { NzAffixComponent } from 'ng-zorro-antd/affix';
import { CustomDirectiveModule } from '../../shared/directive/custom-directive.module';

@NgModule({
    declarations: [
        NewsTypeComponent,
        NewsTypeAddOrChangeComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: NewsTypeComponent,
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

export class NewsTypeModule {
}
