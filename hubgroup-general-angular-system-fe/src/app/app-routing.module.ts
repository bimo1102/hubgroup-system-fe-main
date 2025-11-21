import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./modules/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'error',
        loadChildren: () =>
            import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
    },
    {
        path: '',
        // canActivate: [AuthGuard],
        loadChildren: () =>
            import('./_metronic/layout/layout.module').then((m) => m.LayoutModule),
    },
    {
        path: 'layout-empty',
        loadChildren: () =>
            import('./_metronic/layout-empty/layout-empty.module').then((m) => m.LayoutEmptyModule),
    },
    { path: '**', redirectTo: 'error/404' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
