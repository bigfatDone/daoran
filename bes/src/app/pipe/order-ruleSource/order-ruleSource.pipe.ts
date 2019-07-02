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
        for (let i=0;i<arr.length;i++) {
          nameArr.push(orderRuleSource[parseInt(arr[i])].name);
        }
      } else {
        nameArr.push(orderRuleSource[parseInt(value)].name);
      }
      return nameArr.toString();
    }

  }
}
