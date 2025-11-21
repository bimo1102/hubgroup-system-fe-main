import { Pipe, PipeTransform } from '@angular/core';
import { isNumber } from 'lodash';

@Pipe({ name: 'format' })

export class CustomFormatPipe implements PipeTransform {
    transform(value?: number, format: string = ',') {
        return isNumber(value)  ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, format) : value;
    }
}
