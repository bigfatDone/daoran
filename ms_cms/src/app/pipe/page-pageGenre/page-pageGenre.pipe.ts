import { Pipe, PipeTransform } from '@angular/core';
import { pageGenre } from '../../global-constant';
@Pipe({
  name: 'pageGenre'
})
export class PagePageGenrePipe implements PipeTransform {
  transform(value) {
    for (let i of pageGenre) {
      if (i.type === parseInt(value)) {
        return i.name;
      }
    }
  }
}
