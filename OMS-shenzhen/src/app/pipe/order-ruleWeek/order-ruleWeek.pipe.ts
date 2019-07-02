import { Pipe, PipeTransform } from '@angular/core';
import { orderRuleWeek } from '../../global-constant';
@Pipe({
  name: 'orderRuleWeek'
})
export class OrderRuleWeekPipe implements PipeTransform {
  transform(value) {
    let nameArr = [];
    if (value.indexOf(",") !== -1) {
      let arr = value.split(",");
      for (let n = 0; n < arr.length; n++) {
        orderRuleWeek.forEach(i => {
          if (i.value === parseInt(arr[n])) {
            nameArr.push(i.name);
          }
        });
      }
    } else {
      orderRuleWeek.forEach(i => {
        if (i.value === parseInt(value)) {
          nameArr.push(i.name);
        }
      });
    }
    return nameArr.toString();
  }
}
