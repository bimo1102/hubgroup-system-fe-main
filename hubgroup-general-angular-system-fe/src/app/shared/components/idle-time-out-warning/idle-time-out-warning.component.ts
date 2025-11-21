import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { interval, Subscription } from 'rxjs';

@Component({
    selector: 'app-news-idle-time-out-warning',
    templateUrl: './idle-time-out-warning.component.html',
})
export class IdleTimeOutWarningComponent implements OnInit, OnDestroy {
    constructor(private nzModalRef: NzModalRef) {
    }

    countDown: number = 100;
    subscript: Subscription = Subscription.EMPTY;

    ngOnInit() {
        this.subscript = interval(1000).pipe().subscribe(x => {
            this.countDown--;
            if (this.countDown == 0) {
                this.onClose();
            }
        });
    }

    ngOnDestroy() {
        this.subscript.unsubscribe();
    }

    onClose() {
        this.nzModalRef.close();
    }
}
