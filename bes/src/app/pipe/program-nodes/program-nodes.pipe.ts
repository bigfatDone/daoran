import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'programNodes'
})
export class ProgramNodesPipe implements PipeTransform {
  transform(value, data) {
    if (value) {
      let nameStr = [];
      let arr = value.split(",");
      for (let i of arr) {
        for (let m of data) {
          if (m.nodeCode === i) {
            nameStr.push(m.alias);
          }
        }
      }
      return nameStr.toString();
    }
  }
}
