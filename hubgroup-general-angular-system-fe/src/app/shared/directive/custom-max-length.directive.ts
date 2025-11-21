import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

function createCustomMaxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;
    if (!value || !maxLength) {
      return null;
    }
    return value.length > maxLength ? {customMaxLength: true} : null;
  }
}

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "[customMaxLength]",
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: CustomMaxLengthDirective,
    multi: true
  }]
})

export class CustomMaxLengthDirective implements Validator {
  @Input('customMaxLength') maxLength: number;

  validate(control: AbstractControl): ValidationErrors | null {
    return createCustomMaxLengthValidator(this.maxLength)(control);
  }
}
