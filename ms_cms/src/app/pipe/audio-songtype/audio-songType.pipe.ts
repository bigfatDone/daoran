import { Pipe, PipeTransform } from '@angular/core';
import {audioSongType} from '../../global-constant';
@Pipe({
  name: 'audSongType'
})
export class AudioSongTypePipe implements PipeTransform {
  transform(value) {
    for (let i of audioSongType) {
      if (i.type === value) {
        return i.name;
      }
    }
  }
}
