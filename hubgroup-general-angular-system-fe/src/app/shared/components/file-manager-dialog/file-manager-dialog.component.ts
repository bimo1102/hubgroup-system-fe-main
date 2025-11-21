import { Component, OnInit, inject } from '@angular/core';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-file-manager-dialog',
    templateUrl: './file-manager-dialog.component.html',
})
export class FileManagerDialogComponent implements OnInit {
    readonly nzModalData: any = inject(NZ_MODAL_DATA);
    protected props: any;
    constructor(private modal: NzModalRef) {}

    onClosePopup(file: any) {
        this.modal.close(file);
    }

    ngOnInit(): void {
        this.props = {
            ...this.nzModalData,
            isFromDialog: true,
            closeFunc: this.onClosePopup.bind(this),
        };
    }
}
