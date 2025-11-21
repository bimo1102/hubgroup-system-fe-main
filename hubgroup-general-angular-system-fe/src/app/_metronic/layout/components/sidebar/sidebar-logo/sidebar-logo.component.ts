import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutType } from '../../../core/configs/config';
import { LayoutService } from '../../../core/layout.service';
import { AngularEnvironmentService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-sidebar-logo',
    templateUrl: './sidebar-logo.component.html',
    styleUrls: ['./sidebar-logo.component.scss'],
})
export class SidebarLogoComponent implements OnInit, OnDestroy {
    private unsubscribe: Subscription[] = [];
    @Input() toggleButtonClass: string = '';
    @Input() toggleEnabled: boolean;
    @Input() toggleType: string = '';
    @Input() toggleState: string = '';
    currentLayoutType: LayoutType | null;

    toggleAttr: string;
    logoUrl: string = '';

    constructor(private layout: LayoutService, private angularEnvironmentService: AngularEnvironmentService) {
    }

    ngOnInit(): void {
        this.logoUrl = this.angularEnvironmentService.environment.logoUrl || '';

        this.toggleAttr = `app-sidebar-${this.toggleType}`;
        const layoutSubscr = this.layout.currentLayoutTypeSubject
            .asObservable()
            .subscribe((layout) => {
                this.currentLayoutType = layout;
            });
        this.unsubscribe.push(layoutSubscr);
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}
