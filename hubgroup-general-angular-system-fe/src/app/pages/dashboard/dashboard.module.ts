import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NzAlertComponent } from 'ng-zorro-antd/alert';
import { ComponentShareModule } from '../../shared/components/component-share.module';
import { TranslateModule } from '@ngx-translate/core';
import { NzFlexDirective } from 'ng-zorro-antd/flex';
import { SharedModule } from '../../_metronic/shared/shared.module';
import { CustomPipeModule } from '../../shared/pipe/custom-pipe.module';
import { NzSkeletonComponent } from 'ng-zorro-antd/skeleton';

@NgModule({
    declarations: [DashboardComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: DashboardComponent,
            },
        ]),
        NzAlertComponent,
        ComponentShareModule,
        TranslateModule,
        NzFlexDirective,
        SharedModule,
        CustomPipeModule,
        NzSkeletonComponent,
    ],
})
export class DashboardModule {
}
