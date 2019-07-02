import { Pipe, PipeTransform } from '@angular/core';
import { concodeTypeData } from '../../global-constant';
@Pipe({
  name: 'concodeTypeData'
})
export class ConcodeTypePipe implements PipeTransform {
  transform(value) {
    for (let i of concodeTypeData) {
      if (i.type === parseInt(value)) {
        return i.value;
      }
    }
  }
}
