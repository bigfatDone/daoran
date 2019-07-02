import { Pipe, PipeTransform } from '@angular/core';
import { userStatus } from '../../global-constant';
@Pipe({
  name: 'userStatusPipe'
})
export class JumpUserStatusPipe implements PipeTransform {
  transform(value) {
    for (let i of userStatus) {
      if (i.value === parseInt(value)) {
        return i.name;
      }
    }
  }
}
