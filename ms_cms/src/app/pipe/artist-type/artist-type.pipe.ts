import { Pipe, PipeTransform } from '@angular/core';
import {artType} from '../../global-constant';
@Pipe({
  name: 'artistType'
})
export class ArtistTypePipe implements PipeTransform {
  transform(value) {
    for (let i of artType) {
      if (i.type === value) {
        return i.name;
      }
    }
  }
}
