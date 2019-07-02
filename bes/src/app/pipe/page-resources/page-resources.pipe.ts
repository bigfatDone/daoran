import { Pipe, PipeTransform } from '@angular/core';
import { pageResType } from '../../global-constant';
@Pipe({
  name: 'pageResources'
})
export class PageResourcesPipe implements PipeTransform {
  transform(value) {
    for (let i of pageResType) {
      if (i.type === parseInt(value)) {
        return i.name;
      }
    }
  }
}
