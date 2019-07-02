import { Pipe, PipeTransform } from '@angular/core';
import {artArea} from '../../global-constant';
@Pipe({
  name: 'artistArea'
})
export class ArtistAreaPipe implements PipeTransform {
  transform(value) {
    for (let i of artArea) {
      if (i.type === value) {
        return i.name;
      }
    }
  }
}
