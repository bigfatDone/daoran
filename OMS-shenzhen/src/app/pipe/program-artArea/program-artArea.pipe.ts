import { Pipe, PipeTransform } from '@angular/core';
import { programArtAreas } from '../../global-constant';
@Pipe({
  name: 'programArtArea'
})
export class ProgramArtAreaPipe implements PipeTransform {
  transform(value) {
    for (let i of programArtAreas) {
      if (i.value === parseInt(value)) {
        return i.name;
      }
    }
  }
}
