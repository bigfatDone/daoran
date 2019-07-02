import { Pipe, PipeTransform } from '@angular/core';
import { userDefaultData } from '../../global-constant';
@Pipe({
  name: 'userType'
})
export class UserTypePipe implements PipeTransform {
  transform(value) {
    if (value === null) return userDefaultData.type[0].name;
    for (let i of userDefaultData.type) {
      if (i.id === parseInt (value)) {
        return i.name;
      }
    }
  }
}
