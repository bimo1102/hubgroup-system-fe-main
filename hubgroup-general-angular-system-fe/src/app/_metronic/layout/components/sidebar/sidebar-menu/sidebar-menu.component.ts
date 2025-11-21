import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MenuComponent } from 'src/app/_metronic/kt/components/MenuComponent';
import { DrawerComponent } from 'src/app/_metronic/kt/components/_DrawerComponent';
import { ToggleComponent } from 'src/app/_metronic/kt/components/_ToggleComponent';
import { ScrollComponent } from 'src/app/_metronic/kt/components/_ScrollComponent';
import { MenuService } from '../../../../../shared/services/menu.service';
import { MenuModel } from '@hubgroup-share-system-fe/types/menu.type';
import {
    MenuPosition,
    MenuTypeEnum,
    SystemOptionEnum,
} from '@hubgroup-share-system-fe/enums/menu.enum';
import { isEmpty } from 'lodash';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../../../shared/common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModuleBaseComponent } from '../../../../../shared/base-components/module-base-component';
import {
    AngularAuthService,
    AngularEnvironmentService,
    AngularSharedService,
} from 'nexussoft-angular-shared';

@Component({
    selector: 'app-sidebar-menu',
    templateUrl: './sidebar-menu.component.html',
    styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent
    extends ModuleBaseComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    protected readonly MenuTypeEnum = MenuTypeEnum;

    protected systemOptionEnv: SystemOptionEnum = SystemOptionEnum.VMSV1;
    protected cmsDataMenuVmsPrefixesEnv = [];
    protected cmsNewsMenuPositionEnv = 1;
    protected cmsDataMenuPositionEnv = 30;

    isMenuLoading = false;
    activeTabSelected: MenuPosition.CMSMenu = this.cmsNewsMenuPositionEnv;
    menus: Array<MenuModel> = [];

    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private menuService: MenuService,
        private router: Router,
        private angularEnvironmentService: AngularEnvironmentService,
        private angularAuthService: AngularAuthService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    ngOnInit(): void {
        const { systemOption, cmsDataMenuVmsPrefixes, cmsDataMenuPosition, cmsNewsMenuPosition } =
            this.angularEnvironmentService.environment;
        this.systemOptionEnv = systemOption!;
        this.cmsDataMenuVmsPrefixesEnv = cmsDataMenuVmsPrefixes || [];
        this.cmsNewsMenuPositionEnv = cmsDataMenuPosition || 1;
        this.cmsDataMenuPositionEnv = cmsNewsMenuPosition || 30;

        const currentUrl = this.router.url;
        if (this.cmsDataMenuVmsPrefixesEnv.some((path) => currentUrl.includes(path))) {
            this.activeTabSelected = this.cmsDataMenuPositionEnv;
        }
        const subscription = this.angularAuthService.currentUser$.subscribe((user) => {
            if (!isEmpty(user) && user.isLogin && !user.isNeedOtpVerify && user.token) {
                (async () => {
                    await this.getMenusDisplay(this.activeTabSelected);
                })();
            }
        });
        this.unsubscribe.push(subscription);
    }

    ngAfterViewInit() {}

    ngOnDestroy() {
        this.unsubscribe.forEach((sb: { unsubscribe: () => any }) => sb.unsubscribe());
    }

    menuReinitialization() {
        setTimeout(() => {
            MenuComponent.reinitialization();
            DrawerComponent.reinitialization();
            ToggleComponent.reinitialization();
            ScrollComponent.reinitialization();
        }, 50);
    }

    async selectMenu(tabId: typeof this.activeTabSelected) {
        this.activeTabSelected = tabId;
        await this.getMenusDisplay(this.activeTabSelected);
    }

    getActiveCSSClasses(tabId: typeof this.activeTabSelected) {
        return tabId !== this.activeTabSelected ? '' : 'active show';
    }

    async getMenusDisplay(menuPosition: MenuPosition) {
        this.menus = [];
        this.isMenuLoading = true;

        let action = this.menuService.display.bind(this.menuService);

        const response: BaseResponse<{
            menus: Array<MenuModel>;
            menusByUser?: Array<MenuModel>;
        }> = await this.onAction(false, action, menuPosition);

        this.isMenuLoading = false;
        if (response.status) {
            const menus = response.data?.menus || [];
            this.menus = menus.map((menuItem) => {
                let classIcon = menuItem.cssClassIcon;
                if (
                    !classIcon &&
                    (menuItem.type === MenuTypeEnum.Link || menuItem.type === MenuTypeEnum.Brand)
                ) {
                    classIcon = './assets/media/icons/duotune/general/gen025.svg';
                }
                return {
                    ...menuItem,
                    cssClassIcon: classIcon,
                };
            });
            this.menuReinitialization();
        }
        this.cdr.detectChanges();
    }
}
