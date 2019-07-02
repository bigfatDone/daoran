import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { environment } from '../../../environments/environment';


@Injectable()
export class GatewayBusinessService {

  constructor(private httpService: HttpService, private toastService: ToastService) { }

  api: any = {
    gwList: "/busi/gw/task/getList",
    pointList: "/busi/node/getNodes",
    savePoint: "/busi/gw/trigger/update",
    sqllog: "/busi/gw/sqllog/getList",
    sqllogDetails: "/busi/gw/sqllog/getListDetails",
  };

  gwListPost(param, callback) {
    this.httpService.postFormData(this.api.gwList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  sqllogList(param, callback) {
    this.httpService.postFormData(this.api.sqllog, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  sqllogDetails(param, callback) {
    this.httpService.postFormData(this.api.sqllogDetails, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  pointListPost(callback) {
    this.httpService.postFormData(this.api.pointList, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  savePointPost(param, callback) {
    this.httpService.postFormData(this.api.savePoint, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

}

