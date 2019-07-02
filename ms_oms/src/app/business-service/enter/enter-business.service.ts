import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';

@Injectable()

export class EnterBusinessService {

  constructor(private httpService: HttpService, private toastService: ToastService) { }

  api: any = {
    login: "/checkuser",
  }

  userLogin(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.login, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      const toastCfg = new ToastConfig(ToastType.ERROR, '', '登录失败！', 3000);
      that.toastService.toast(toastCfg);
    });
  }
}
