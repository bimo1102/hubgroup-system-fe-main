import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-news-not-found',
    templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {
    constructor() {
    }

    @Input() title: string = 'data.no.result.found';
    @Input() description: string = 'please.try.again.with.a.different.query';

    ngOnInit() {
    }
}
