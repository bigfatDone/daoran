import { Pipe, PipeTransform } from '@angular/core';
import { gwTaskStates } from '../../global-constant';
@Pipe({
  name: 'gwTaskStates'
})
export class GwTaskStatesPipe implements PipeTransform {
  transform(value) {
    for (let i of gwTaskStates) {
      if (i.value === parseInt(value)) {
        return i.name;
      }
    }
  }
}
