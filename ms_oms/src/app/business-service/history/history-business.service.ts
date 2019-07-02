import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';

@Injectable()
export class HistoryBusinessService {

  constructor(private httpService: HttpService, private toastService: ToastService) {
  }

  api: any = {
    getListDataApi: "/busi/pagehis/getList",
    pictureList: "/busi/picturewall/getPictureWallList",
    pictureInfo: "/busi/picturewall/getWall",
    pictureSave: "/busi/picturewall/save",
    pictureDel: "/busi/picturewall/delWall",
    pictureCan: "/busi/picturewall/getEleList",
    pictureAlready: "/busi/picturewall/getWallListDetail",
    pictureOk: "/busi/picturewall/addEleToWall",
    updateStateApi: "/busi/pagehis/update/state",
    getElementDetailApi: "/busi/pagehis/getElement",
    getElelistApi: "/busi/element/elelist",
    getEleresApi: "/busi/element/eleres",
    del: "/busi/pagehis/delete",
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

  getElelistService(param, callback) { // 获取播放节目单，只视节目单详情
    this.httpService.postFormData(this.api.getElelistApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getElementDetailService(param, callback) { // 获取详情
    this.httpService.postFormData(this.api.getElementDetailApi, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  updateStateService(param, callback) { // 显示隐藏
    this.httpService.postFormData(this.api.updateStateApi, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      console.log(err);
    });
  }

  getListDataService(param, callback) { // 主列表
    this.httpService.postFormData(this.api.getListDataApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    });
  }

  getPictureList(param, callback) { // 照片墙列表
    this.httpService.postFormData(this.api.pictureList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    });
  }

  getPictureInfo(param, callback) {
    this.httpService.postFormData(this.api.pictureInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getPictureSave(param, callback) {
    this.httpService.postFormData(this.api.pictureSave, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  delPicture(param, callback) {
    this.httpService.postFormData(this.api.pictureDel, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getPictureCan(param, callback) {
    this.httpService.postFormData(this.api.pictureCan, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getPictureAlready(param, callback) {
    this.httpService.postFormData(this.api.pictureAlready, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getPictureOk(param, callback) {
    this.httpService.postFormData(this.api.pictureOk, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  del(param, callback) {
    this.httpService.postFormData(this.api.del, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

}
