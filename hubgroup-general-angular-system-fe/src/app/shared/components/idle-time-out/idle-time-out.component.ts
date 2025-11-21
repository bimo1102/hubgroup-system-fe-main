import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-news-idle-time-out',
    templateUrl: './idle-time-out.component.html',
})
export class IdleTimeOutComponent implements OnInit {
    constructor(private nzModalRef: NzModalRef) {
    }

    ngOnInit() {
    }

    onClose() {
        this.nzModalRef.close();
    }
}
