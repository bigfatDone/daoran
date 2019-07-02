import { Pipe, PipeTransform } from '@angular/core';
import { carrierAttr } from '../../global-constant';
@Pipe({
  name: 'carrier'
})
export class CarrierPipe implements PipeTransform {
  transform(value) {
    if (value === null) return carrierAttr[0].name;
    for (let i of carrierAttr) {
      if (i.type === parseInt(value)) {
        return i.name;
      }
    }
  }
}
