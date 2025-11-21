import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutEmptyComponent } from './layout-empty.component';
import { NewsCanActiveGuard } from '../../shared/Guard/news.guard';

const routes: Routes = [
    {
        path: '',
        canActivate: [NewsCanActiveGuard],
        component: LayoutEmptyComponent,
        children: [
        ],
    },
];

@NgModule({
    declarations: [
        LayoutEmptyComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})
export class LayoutEmptyModule {
}
