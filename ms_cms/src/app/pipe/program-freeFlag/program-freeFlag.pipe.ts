import { Pipe, PipeTransform } from '@angular/core';
import { freeFlag } from '../../global-constant';
@Pipe({
  name: 'programFreeFlag'
})
export class ProgramFreeFlagPipe implements PipeTransform {
  transform(value) {
    for (let i of freeFlag) {
      if (i.type === parseInt(value)) {
        return i.name;
      }
    }
  }
}
