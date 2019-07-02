import { Pipe, PipeTransform } from '@angular/core';
import {videoSongType} from '../../global-constant';
@Pipe({
  name: 'vidSongType'
})
export class VideoSongTypePipe implements PipeTransform {
  transform(value) {
    for (let i of videoSongType) {
      if (i.type === value) {
        return i.name;
      }
    }
  }
}
