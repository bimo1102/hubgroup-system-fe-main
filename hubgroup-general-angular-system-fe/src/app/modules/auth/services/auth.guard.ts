import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularAuthService } from 'nexussoft-angular-shared';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    constructor(private angularAuthService: AngularAuthService) {
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.angularAuthService.currentUserValue;
        if (currentUser) {
            return true;
        }
        // not logged in so redirect to login page with the return url
        // await this.authService.logout();
        return false;
    }

    canActivateChild( childRoute: ActivatedRouteSnapshot,
                      state: RouterStateSnapshot){
        return true
    }

    canDeactivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return true
    }

}
