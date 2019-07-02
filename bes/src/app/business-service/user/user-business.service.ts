import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
@Injectable()
export class UserBusinessService {
  constructor(private httpService: HttpService, private toastService: ToastService) { }
  api: any = {
    login: "/login.do",
    logout: "/loginOut.do",
    isLogin: "/isLogin.do",
    captcha: "/captcha.bmp",
    userList: "/getListUser.do",
    userTypeList: "/user/list",
    saveUser: "/user/save",
    delUser: "/delUser.do",
    getUserInfo: "/user/",
    lockUser: "/user/lock",
    saveNewpwd: "/user/save/newpwd",
  }

  userLogin(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.login, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', '登录失败！', 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  userLogout(callback) {
    this.httpService.postFormData(this.api.logout, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', '登录失败！', 3000);
      // this.toastService.toast(toastCfg);
    });
  }

  getUserList(param, callback) {
    this.httpService.postFormData(this.api.userList, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  saveUser(param, callback) {
    this.httpService.postFormData(this.api.saveUser, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }
  delUser(param, callback) {
    this.httpService.postFormData(this.api.delUser, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }

  getUserInfo(param, callback) {
    this.httpService.get(this.api.getUserInfo+param, "", function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }

  lockUser(param, callback) {
    this.httpService.postFormData(this.api.lockUser, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }

  saveUserPwd(param, callback) {
    this.httpService.postFormData(this.api.saveNewpwd, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }

  isLogin(callback) {
    let that = this;
    this.httpService.postFormData(this.api.isLogin, {}, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {}, false);
  }

}
