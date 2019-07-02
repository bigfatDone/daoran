import { Pipe, PipeTransform } from '@angular/core';
import { userDefaultData } from '../../global-constant';
@Pipe({
  name: 'userCompany'
})
export class UserCompanyPipe implements PipeTransform {
  transform(type, data) {
    let result = "";
    let typeNum = parseInt(type);
    if (type != null) {
      switch (typeNum) {
        case userDefaultData.type[1].id:
          result = data.cname;
          break;
        case userDefaultData.type[2].id:
          result = data.pname;
          break;
        default:
          result = "";
          break;
      }
    }
    return result;
  }
}
