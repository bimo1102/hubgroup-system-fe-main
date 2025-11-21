import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LazyLoadingScriptService implements OnDestroy {
    private render2: Renderer2;
    _loadedLibraries: { [url: string]: ReplaySubject<any> } = {};
    _eventListener: any[] = [];

    constructor(rendererFactory: RendererFactory2) {
        this.render2 = rendererFactory.createRenderer(null, null);
    }

    addScript(url: string) {
        this._loadedLibraries[url] = new ReplaySubject();
    }

    loadScript(url: string, wrapperScriptElement: HTMLElement, functionCreateScript: () => HTMLScriptElement): Observable<any> {
        if (this._loadedLibraries[url]) {
            return this._loadedLibraries[url].asObservable();
        }

        this._loadedLibraries[url] = new ReplaySubject();

        const scriptElement = functionCreateScript();

        const listener = this.render2.listen(scriptElement, 'load', () => {
            this._loadedLibraries[url].next(true);
            this._loadedLibraries[url].complete();
        });
        this._eventListener.push(listener);
        wrapperScriptElement.appendChild(scriptElement);

        return this._loadedLibraries[url].asObservable();
    }

    destroy() {
        this._eventListener.forEach((func: any) => func());
        this._loadedLibraries = {};
    }

    ngOnDestroy() {
        this._eventListener.forEach((func: any) => func());
    }
}
