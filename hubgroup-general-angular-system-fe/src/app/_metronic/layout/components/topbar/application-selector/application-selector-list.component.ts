import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';


@Component({
    selector: 'app-application-selector-list',
    templateUrl: './application-selector-list.component.html',
})
export class ApplicationSelectorListComponent implements OnInit, OnDestroy {
    @HostBinding('class')
    class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
    @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

    @Output() changeFunc = new EventEmitter<any>();
    @Input() websiteModels: any[] = [];

    constructor() {
    }

    async ngOnInit() {
    }

    onSelect(website: any) {
        this.changeFunc.emit(website);
    };

    ngOnDestroy() {
    }
}
