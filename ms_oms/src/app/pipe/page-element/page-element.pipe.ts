import { Pipe, PipeTransform } from '@angular/core';
import { pageEleType } from '../../global-constant';
@Pipe({
  name: 'pageElement'
})
export class PageElementPipe implements PipeTransform {
  transform(value) {
    for (let i of pageEleType) {
      if (i.type === value) {
        return i.name;
      }
    }
  }
}
