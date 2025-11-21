import { Component, OnInit } from '@angular/core';
import { UserLoginCompletedResponse } from '@hubgroup-share-system-fe/types/account.type';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
})
export class LoginDialogComponent implements OnInit {
    constructor(private modalRef: NzModalRef) {}

    ngOnInit() {}

    onClose(data: UserLoginCompletedResponse) {
        this.modalRef.close(data);
    }
}
