import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    createComponent,
    ElementRef,
    EnvironmentInjector,
    Input,
    OnDestroy,
    OnInit,
    Type,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { loadRemoteModule } from '@hubgroup-share-system-fe/utils/federation-utils';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-angular-wrapper',
    templateUrl: './angular-wrapper.component.html',
    styleUrls: ['./angular-wrapper.component.scss'],
})
export class AngularWrapperComponent implements OnInit, OnDestroy {
    constructor(
        private cdr: ChangeDetectorRef,
        private injector: EnvironmentInjector,
        private viewContainerRef: ViewContainerRef
    ) {}

    @Input({
        alias: 'moduleName',
        required: true,
    })
    moduleName: string;
    @Input() props: any = {};
    @Input({ required: true, alias: 'type' }) type: 'component' | 'module' = 'module';
    @Input() componentName: string = '';
    @Input() moduleClassName: string = '';
    @Input() componentClassName: string = '';

    private componentRef: ComponentRef<any>;
    isLoadingModule: boolean = false;
    @Input() isModalMode: boolean = false;

    async ngOnInit() {
        await this.renderComponent();
    }

    async renderComponent() {
        // if (!this.root.nativeElement) return;
        if (!this.moduleName) return;
        this.isLoadingModule = true;
        try {
            const splitModuleName = this.moduleName.split('/');
            const remoteEntry = `${splitModuleName[0]}Url`;
            const componentName = splitModuleName[1];
            const requestModule = {
                remoteName: splitModuleName[0],
                exposedModule: `./${componentName}`,
                remoteEntry: (environment[remoteEntry as keyof typeof environment] +
                    '/remoteEntry.js') as string,
            };
            const module = await loadRemoteModule(requestModule);
            let ComponentDefination: any = null;
            if (this.type == 'module') {
                const instance = module[this.moduleClassName];
                if (instance && typeof instance == 'function') {
                    if (instance.getComponent && typeof instance.getComponent == 'function') {
                        ComponentDefination = instance.getComponent();
                    }
                }
            }
            if (this.type == 'component') {
            }
            this.componentRef = this.viewContainerRef.createComponent(ComponentDefination, {
                injector: this.injector,
            });
            if (Object.keys(this.props).length > 0) {
                for (const key in this.props) {
                    if (typeof this.props[key] == 'function') {
                        this.componentRef.instance[key].subscribe((data: any) =>
                            this.props[key](data)
                        );
                    } else {
                        this.componentRef.instance[key] = this.props[key];
                    }
                }
            }
            this.isLoadingModule = false;
        } catch (error) {
            this.isLoadingModule = false;
            console.log('Load AngularModule Error: ', error);
        }
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
        }
    }
}
