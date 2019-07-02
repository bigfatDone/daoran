import { Pipe, PipeTransform } from '@angular/core';
import {paintSongType} from '../../global-constant';
@Pipe({
  name: 'drawSoogType'
})
export class DrawSoogTypePipe implements PipeTransform {
  transform(value) {
    for (let i of paintSongType) {
      if (i.type === value) {
        return i.name;
      }
    }
  }
}
