import { Injectable } from '@angular/core';
import { TytHttpClient } from '../tyt-http-client.service';
import { BehaviorSubject } from 'rxjs';
import {
    CrawlNewsCrawlRequest,
    CrawlNewsResultModel,
} from '@hubgroup-share-system-fe/types/news-crawl.type';
import { BaseResponse } from '@hubgroup-share-system-fe/types/common.type';

@Injectable({ providedIn: 'root' })
export class NewsCrawlService {
    constructor(private http: TytHttpClient) {}

    newsCopy$ = new BehaviorSubject<CrawlNewsResultModel | null>(null);

    get currentCrawlNewsResultModel(): CrawlNewsResultModel | null {
        return this.newsCopy$.getValue();
    }

    set currentCrawlNewsResultModel(crawlNewsResultModel: CrawlNewsResultModel) {
        this.newsCopy$.next(crawlNewsResultModel);
    }

    async crawl(request: CrawlNewsCrawlRequest): Promise<BaseResponse<CrawlNewsResultModel>> {
        return await this.http.post('/CrawlNews/Crawl', request);
    }
}
