import { Pipe, PipeTransform } from '@angular/core';
import { programType } from '../../global-constant';
@Pipe({
  name: 'programType'
})
export class ProgramTypePipe implements PipeTransform {
  transform(value) {
    for (let i of programType) {
      if (i.type === parseInt(value)) {
        return i.name;
      }
    }
  }
}
