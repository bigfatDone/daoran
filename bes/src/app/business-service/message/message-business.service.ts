import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
@Injectable()
export class MessageBusinessService {
  constructor(private httpService: HttpService, private toastService: ToastService) { }
  api: any = {
    // bes消息推送
    // unreadMessageNum: "/bes/system/unreadMessageNum",
    unreadMessageNum: "/system/unreadMessageNum",
    mineMessageList: "/system/mineMessage",
    updateMessage: "/system/updateMessage",
    // bes系统用
    addMessage: "/system/addMessage",
    listMessage: "/system/message",
    deleteMessage: "/system/deleteMessage",
    // 用户操作记录
    userLogs: "/userLogs/list",
    seeUserLogs: "/userLogs/getById",

  }

  // 用户操作记录
  userLogs(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.userLogs, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    },false);
  }
  seeUserLogs(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.seeUserLogs, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    },false);
  }


  listMessage(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.listMessage, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  addMessage(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.addMessage, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  deleteMessage(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.deleteMessage, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  unreadMessageNum(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.unreadMessageNum, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  mineMessageList(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.mineMessageList, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  updateMessage(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.updateMessage, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  uploadFlag = true;
  ArtistList(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.artistList , param, function (successful, data, res) {
      if (successful) {
        that.uploadFlag = false;
        callback(data.data);
      }
    }, function (successful, msg, err) {
    },that.uploadFlag);
  }

  artistsInfo(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.artistsInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  artistsSave(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.artistsSave, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  uploadPicPost(param, callback) {
    this.httpService.postFormFile(this.api.uploadPic, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getArtPicDetail(param, callback) {
    this.httpService.postFormData(this.api.getArtPicDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  artistsExcel(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.artistsExcel, param, function (successful, data, res) {

      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  delArtistPic(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.delDrawPic , param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  setDefaultPic(param, callback) {
    this.httpService.postFormData(this.api.setDefaultPic, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
}
