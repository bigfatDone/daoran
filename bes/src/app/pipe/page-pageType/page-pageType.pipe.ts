import { Pipe, PipeTransform } from '@angular/core';
import { pageTypeData } from '../../global-constant';
@Pipe({
  name: 'pagePageType'
})
export class PagePageTypePipe implements PipeTransform {
  transform(value) {
    for (let i of pageTypeData) {
      if (i.type === parseInt(value)) {
        return i.name;
      }
    }
  }
}
