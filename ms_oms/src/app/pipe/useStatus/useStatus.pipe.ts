import { Pipe, PipeTransform } from '@angular/core';
import { odSysState } from '../../global-constant';
@Pipe({
  name: 'useStatus'
})
export class UseStatusPipe implements PipeTransform {
  transform(value) {
    if (value === null) return odSysState[0].name;
    for (let i of odSysState) {
      if (i.type === parseInt(value)) {
        return i.name;
      }
    }
  }
}
