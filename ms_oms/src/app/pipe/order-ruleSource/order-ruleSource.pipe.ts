import { Pipe, PipeTransform } from '@angular/core';
import { orderRuleSource } from '../../global-constant';
@Pipe({
  name: 'orderRuleSource'
})
export class OrderRuleSourcePipe implements PipeTransform {
  transform(value) {
    if (value) {
      let nameArr = [];
      if (value.indexOf(",") !== -1) {
        let arr = value.split(",");
        for (let i = 0; i < orderRuleSource.length; i++) {
          if (value.indexOf(String(orderRuleSource[i].value)) !== -1) {
            nameArr.push(orderRuleSource[i].name);
          }
        }
      } else {
        for (let n = 0; n < orderRuleSource.length; n++) {
          if (orderRuleSource[n].value === parseInt(value)) {
            nameArr.push(orderRuleSource[n].name);
          }
        }
      }
      return nameArr.toString();
    }

  }
}
