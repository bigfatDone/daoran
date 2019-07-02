import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';

@Injectable()
export class PictureBusinessService {

  constructor(private httpService: HttpService, private toastService: ToastService) { }

  api: any = {
    getEleresApi: "/busi/element/eleres",
  };

  getEleresService(param, callback) { // 获取单个资源详情
    this.httpService.postFormData(this.api.getEleresApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
}

