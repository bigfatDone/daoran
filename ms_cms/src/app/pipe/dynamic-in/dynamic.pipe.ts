import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'DynamicPipe'
})
export class DynamicPipe implements PipeTransform {
  transform(value, data) {
    if (data.type === 'product') {
      for (let i of data.data) {
        if (i.sProductcode === value) {
          return i.sProductName;
        }
      }
    } else if (data.type === 'province') {
      for (let i of data.data) {
        if (i.id === value) {
          return i.name;
        }
      }
    } else if (data.type === 'nodeCode') {
      for (let i of data.data) {
        if (i.nodeCode === value) {
          return i.alias;
        }
      }
    }
  }
}
