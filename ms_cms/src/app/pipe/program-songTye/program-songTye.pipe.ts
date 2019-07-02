import { Pipe, PipeTransform } from '@angular/core';
import { pageResType, programSongType } from '../../global-constant';
@Pipe({
  name: 'programSongType'
})
export class ProgramSongTyePipe implements PipeTransform {
  transform(value, type) {
    let curData = [];
    if (type === pageResType[1].type) {
      curData = programSongType.video;
    } else if (type === pageResType[2].type) {
      curData = programSongType.audio;
    } else if (type === pageResType[3].type) {
      curData = programSongType.paint;
    }
    for (let i of curData) {
      if (i.value === value) {
        return i.name;
      }
    }
  }
}
