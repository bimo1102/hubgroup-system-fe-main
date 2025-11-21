import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../common.service';

export const NewsCanActiveGuard: CanActivateFn = async (route, state) => {

    const commonService = inject(CommonService);
    const router = inject(Router);
    commonService.urlRedirectApplicationExist = state.url;
    return true;
    // if (state.url !== '/suggest') {
    //     await router.navigate(['/suggest']);
    // }
    // return false;
};
