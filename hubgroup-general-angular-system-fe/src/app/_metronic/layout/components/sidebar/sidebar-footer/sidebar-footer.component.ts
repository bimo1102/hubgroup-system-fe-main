import { Component, OnInit } from '@angular/core';
import { AngularEnvironmentService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-sidebar-footer',
    templateUrl: './sidebar-footer.component.html',
    styleUrls: ['./sidebar-footer.component.scss'],
})
export class SidebarFooterComponent implements OnInit {
    constructor(private angularEnvironmentService: AngularEnvironmentService) {
    }

    websiteName = '';

    ngOnInit(): void {
        this.websiteName = this.angularEnvironmentService.environment.websiteName || '';
    }
}
