import { Pipe, PipeTransform } from '@angular/core';
import { isNumber } from 'lodash';

@Pipe({ name: 'abs' })

export class CustomAbsPipe implements PipeTransform {
    transform(value?: number): number | string {
        return isNumber(value) ? Math.abs(value) : '';
    }
}
