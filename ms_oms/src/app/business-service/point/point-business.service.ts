import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';


@Injectable()
export class PointBusinessService {

  modalType: String;

  constructor(private httpService: HttpService) { }

  api: any = {
    relateList: "/busi/nodeManager/getList",
  };

  getRelateListPost(param, callback) {
    this.httpService.postFormData(this.api.relateList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

}
