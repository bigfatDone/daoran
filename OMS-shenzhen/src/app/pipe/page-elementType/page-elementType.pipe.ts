import { Pipe, PipeTransform } from '@angular/core';
import { pageEleTypeModal } from '../../global-constant';
@Pipe({
  name: 'pageElementType'
})
export class PageElementTypePipe implements PipeTransform {
  transform(value) {
    for (let i of pageEleTypeModal) {
      if (i.type === value) {
        return i.name;
      }
    }
  }
}
