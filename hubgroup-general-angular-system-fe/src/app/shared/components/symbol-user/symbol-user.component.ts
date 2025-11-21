import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { SignalStatusEnum } from '@hubgroup-share-system-fe/enums/signal-message.enum';
import {
    CurrentUserActivityModel,
    SignalMessageType,
} from '@hubgroup-share-system-fe/types/signal-message.type';
import { shuffle } from 'lodash';

@Component({
    selector: 'app-news-symbol-user',
    templateUrl: './symbol-user.component.html',
})
export class SymbolUserComponent implements OnInit, OnChanges, OnDestroy {
    constructor() {}

    protected readonly SignalStatusEnum = SignalStatusEnum;

    @Input() currentUserConnections: CurrentUserActivityModel[] = [];
    @Input() userSignal: Partial<SignalMessageType>;
    currentSelfConnect: CurrentUserActivityModel;
    randomClassUi: string[] = [
        'bg-danger text-inverse-danger',
        'bg-success text-inverse-success',
        'bg-warning text-inverse-warning',
        'bg-info text-inverse-info',
    ];
    classPrimaryUi = 'bg-primary text-inverse-primary';
    classUi = 'bg-danger text-inverse-danger';

    ngOnInit() {
        this.classUi = this.getRandomClassUi();
    }

    ngOnChanges(): void {
        this.currentSelfConnect = this.currentUserConnections?.find((item) => item.isCurrentUser)!;
    }

    ngOnDestroy() {}

    getRandomClassUi() {
        return shuffle(this.randomClassUi)[0];
    }
}
