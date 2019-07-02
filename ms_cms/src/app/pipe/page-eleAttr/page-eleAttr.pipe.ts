import { Pipe, PipeTransform } from '@angular/core';
import { pageEleAttr } from '../../global-constant';
@Pipe({
  name: 'pageEleAttr'
})
export class PageEleAttrPipe implements PipeTransform {
  transform(value) {
    for (let i of pageEleAttr) {
      if (i.type === parseInt(value)) {
        return i.name;
      }
    }
  }
}
