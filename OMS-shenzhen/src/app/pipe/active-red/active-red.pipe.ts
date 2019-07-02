import { Pipe, PipeTransform } from '@angular/core';
import { redPackageStatusData } from '../../global-constant';
@Pipe({
  name: 'activeRed'
})
export class ActiveRedPipe implements PipeTransform {
  transform(value) {
    for (let i of redPackageStatusData) {
      if (i.type === parseInt(value)) {
        return i.value;
      }
    }
  }
}
