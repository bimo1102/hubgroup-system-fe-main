import { NgModule } from '@angular/core';
import { CustomMaxLengthDirective } from './custom-max-length.directive';

@NgModule({
	declarations: [
		CustomMaxLengthDirective,
	],
	imports: [],
	exports: [CustomMaxLengthDirective],
})
export class CustomDirectiveModule {
}
