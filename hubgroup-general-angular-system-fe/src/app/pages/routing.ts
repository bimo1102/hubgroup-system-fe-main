import { Routes } from '@angular/router';
import { NewsCanActiveGuard } from '../shared/Guard/news.guard';

const Routing: Routes = [
    {
        path: 'dashboard',
        canActivate: [NewsCanActiveGuard],
        loadChildren: () =>
            import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    },
    {
        path: 'news',
        loadChildren: () =>
            import('../modules/news/news.module').then((m) => m.NewsModule),
    },
    {
        path: 'news-category',
        loadChildren: () =>
            import('../modules/news-category/news-category.module').then((m) => m.NewsCategoryModule),
    },
    {
        path: 'news-tag',
        loadChildren: () =>
            import('../modules/tags/tags.module').then((m) => m.TagsModule),
    },
    {
        path: 'news-event',
        loadChildren: () =>
            import('../modules/event/event.module').then((m) => m.EventModule),
    },
    {
        path: 'series',
        loadChildren: () =>
            import('../modules/series/series.module').then((m) => m.SeriesModule),
    },
    {
        path: 'news-source',
        loadChildren: () =>
            import('../modules/news-source/news-source.module').then((m) => m.NewsSourceModule),
    },
    {
        path: 'news-type',
        loadChildren: () =>
            import('../modules/news-type/news-type.module').then((m) => m.NewsTypeModule),
    },
    {
        path: 'icon-config',
        loadChildren: () =>
            import('../modules/icon-config/icon-config.module').then((m) => m.IconConfigModule),
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'error/404',
    },
];

export { Routing };
