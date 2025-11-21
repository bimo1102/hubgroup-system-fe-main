import {
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { KeyValueTypeStringModel } from '@hubgroup-share-system-fe/types/common.type';

@Component({
    selector: 'app-website-selector-list',
    templateUrl: './website-selector-list.component.html',
})
export class WebsiteSelectorListComponent implements OnInit, OnDestroy {
    @HostBinding('class')
    class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
    @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

    @Input() companies: Array<
        KeyValueTypeStringModel & { websites: Array<KeyValueTypeStringModel> }
    > = [];
    @Output() clickChange = new EventEmitter<KeyValueTypeStringModel>();

    constructor() {}

    async ngOnInit() {}

    ngOnDestroy() {}

    async onSelect(website: KeyValueTypeStringModel) {
        this.clickChange.emit(website);
    }
}
