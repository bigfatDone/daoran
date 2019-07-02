import { Pipe, PipeTransform } from '@angular/core';
import { orderRuleStrategy } from '../../global-constant';
@Pipe({
  name: 'orderRuleIType'
})
export class OrderRuleITypePipe implements PipeTransform {
  transform(value) {
    for (let i of orderRuleStrategy) {
      if (i.value === parseInt(value)) {
        return i.name;
      }
    }
  }
}
