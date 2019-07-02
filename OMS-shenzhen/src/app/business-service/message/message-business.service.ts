import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';


@Injectable()
export class MessageBusinessService {
  constructor(private httpService: HttpService) {}

  api: any = {
    messageList: "/system/mineMessage",
    unreadMessageNum: "/system/unreadMessageNum",
    updateMessage: "/system/updateMessage",
    mineMessageAll: "/system/mineMessageAll",
    feedbackList: "/busi/feedback/getList",
    feedbackEdit: "/busi/feedback/edit",
    feedbackDel: "/busi/feedback/del",
    feedbackDetial: "/busi/feedback/detial",
    getAllProductAuth: "/busi/nodeManager/getAllProductAuth",
  }

  // 用户反馈管理
  feedbackList(param, callback) {
    this.httpService.postFormData(this.api.feedbackList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  feedbackEdit(param, callback) {
    this.httpService.postFormData(this.api.feedbackEdit, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  feedbackDel(param, callback) {
    this.httpService.postFormData(this.api.feedbackDel, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  feedbackDetial(param, callback) {
    this.httpService.postFormData(this.api.feedbackDetial, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getAllProductAuth(callback) {
    this.httpService.postFormData(this.api.getAllProductAuth, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }


  // 消息推送相关接口
  mineMessageAll(param, callback) {
    this.httpService.postFormData(this.api.mineMessageAll, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  messageList(param, callback) {
    this.httpService.postFormData(this.api.messageList, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  unreadMessageNum(param, callback) {
    this.httpService.postFormData(this.api.unreadMessageNum, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  updateMessage(param, callback) {
    this.httpService.postFormData(this.api.updateMessage, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }

}
