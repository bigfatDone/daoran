import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';


@Injectable()
export class DepartmentBusinessService {

  constructor(private httpService: HttpService) { }

  modalType: String;

  api: any = {
    list: "/company/list",
    allList: "/company/queryData",
    delete: "/company/delete",
    query: "/company/query",
    saveCompany: "/company/addorUpdateCompany",
    saveDepartment: "/company/addorUpdateDepartment",
    savePosition: "/company/addorUpdatePosition",
    powList: "/company/getPostList",
    getPositionType: "/company/getPositionType",
    queryDataAuth: "/auth/dataAuthQuery",
    queryMenuAuth: "/auth/queryMenuAuth",
    savePower: "/auth/saveDataAuth",
    saveMenuPower: "/auth/addAuth",
    getPowerInfo: "/auth/dataAuthQueryByPostId",
    getPower: "/auth/queryAuth",
  }

  getList(param, callback) {
    this.httpService.postFormData(this.api.list, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  getAllList(param, callback) {

    this.httpService.postFormData(this.api.allList, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }

  delete(param, callback) {
    this.httpService.postFormData(this.api.delete, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  saveCompany(param, callback) {
    this.httpService.postFormData(this.api.saveCompany, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  saveDepartment(param, callback) {
    this.httpService.postFormData(this.api.saveDepartment, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  saveJob(param,callback) {
    this.httpService.postFormData(this.api.savePosition, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  getPowList(param, callback) {
    this.httpService.postFormData(this.api.powList, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  getPositionType(callback) {
    this.httpService.postFormData(this.api.getPositionType, {}, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }

  getQueryDataAuth(callback) {
    this.httpService.postFormData(this.api.queryDataAuth, {}, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }

  getQueryMenuAuth(callback) {
    this.httpService.postFormData(this.api.queryMenuAuth, {}, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }

  savePower(param, callback) {
    this.httpService.postFormData(this.api.savePower, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }

  saveMenuPower(param, callback) {
    this.httpService.postFormData(this.api.saveMenuPower, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }

  getPowerAllInfo(param, callback) {
    this.httpService.postFormData(this.api.getPowerInfo, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }
  getPowerAll(param, callback) {
    this.httpService.postFormData(this.api.getPower, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }
}
