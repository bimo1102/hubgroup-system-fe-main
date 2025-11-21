import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SignalRService } from '../../../../../shared/services/signalr.service';
import { ConnectionStringEnum } from '@hubgroup-share-system-fe/enums/signal-message.enum';
import { AngularAuthService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    @Input() appHeaderDefaulMenuDisplay: boolean;
    @Input() isRtl: boolean;

    itemClass: string = 'ms-1 ms-lg-3';
    btnClass: string =
        'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
    userAvatarClass: string = 'symbol-35px symbol-md-40px';
    btnIconClass: string = 'fs-2 fs-md-1';
    user$: Observable<any>;

    connect$: Observable<{ key: ConnectionStringEnum; value: any }>;

    constructor(
        private angularAuthService: AngularAuthService,
        private signalRService: SignalRService
    ) {}

    protected readonly ConnectionStringEnum = ConnectionStringEnum;

    ngOnInit(): void {
        this.user$ = this.angularAuthService.currentUser$;
        this.connect$ = this.signalRService.onConnectSubscribe$;
    }
}
