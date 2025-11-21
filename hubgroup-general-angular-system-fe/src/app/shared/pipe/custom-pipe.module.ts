import { NgModule } from '@angular/core';
import { CustomAbsPipe } from './custom-abs.pipe';
import { CustomFormatPipe } from './custom-format.pipe';
import { CustomSafePipe } from './custom-safe.pipe';

@NgModule({
    declarations: [
        CustomAbsPipe,
        CustomFormatPipe,
        CustomSafePipe
    ],
    imports: [],
    exports: [
        CustomAbsPipe,
        CustomFormatPipe,
        CustomSafePipe
    ],
})
export class CustomPipeModule {
}
