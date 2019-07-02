import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';


@Injectable()
export class MenuBusinessService {

  modalType: String;

  constructor(private httpService: HttpService) { }

  menuApi: any = {
    list: "/function/list",
    add: "/function/save",
    edit: "/function/edit",
    delete: "/function/",
    sort: "/function/sort",
  }

  getMenuList(callback) {
    let that = this;
    this.httpService.postFormData(this.menuApi.list, {}, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  saveMenu(param,callback) {
    this.httpService.postFormData(this.menuApi.add, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  editMenu(param,callback) {
    this.httpService.postFormData(this.menuApi.edit, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  removeMenu(param, callback) {
    this.httpService.delete(this.menuApi.delete + param, {}, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  saveSort(param, callback) {
    this.httpService.postFormData(this.menuApi.sort, param, function (successful, data, res) {
      callback();
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }
}
