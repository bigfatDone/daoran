import { Pipe, PipeTransform } from '@angular/core';
import {orderRuleSource, categoryAttr} from '../../global-constant';
@Pipe({
  name: 'categoryAttr'
})
export class CategoryEleAttr implements PipeTransform {
  transform(value) {
    let nameArr = [];
    if (value !=="") {

      if (value.indexOf(",") !== -1) {
        let arr = value.split(",");
        for (let i=0;i<arr.length; i++) {
          nameArr.push(categoryAttr[parseInt(arr[i]) - 1].name);
        }
      } else {
        nameArr.push(categoryAttr[parseInt(value) - 1].name);
      }
      return nameArr.toString();
    }
  }
}
