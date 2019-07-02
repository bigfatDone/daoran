import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';


@Injectable()
export class OttoperateBusinessService {
  constructor(private httpService: HttpService) { }

  api: any = {
    vipList: "/busi/copywritring/getList",
    vipSave: "/busi/copywritring/saveCopywritingInfo",
    vipDel: "/busi/copywritring/deleteCopywritingInfo",
    vipDetail: "/busi/copywritring/getCopywritingInfo",
    apkList: "/busi/ottoperate/apkVersionInfo/list",
    apkDel: "/busi/ottoperate/apkVersionInfo/deleteApkVersionInfoById",
    apkSave: "/busi/ottoperate/apkVersionInfo/save",
    uploadAPK: "/busi/ottoperate/apkVersionInfo/uploadApk",
    getOTTItem: "/busi/ottoperate/apkVersionInfo/getOTTItem",
    getOTTItemNew: "/busi/ottoperate/apkVersionInfo/getOTTItemByProductCode",
    apkDetail: "/busi/ottoperate/apkVersionInfo/getApkVersionInfoById",
    getOTTProduct:"/busi/ottoperate/apkVersionInfo/getOTTProduct",
    elementList:"/busi/element/elementList",
    saveElement:"/busi/element/saveElement",
    getElementInfo:"/busi/element/getElementInfo",

    // 运营位
    listPagePopup:"/busi/pagepopup/listPagePopup",
    getPagePopupById:"/busi/pagepopup/getPagePopupById",
    savePagePopup:"/busi/pagepopup/savePagePopup",
    delPagePopup:"/busi/pagepopup/delPagePopup",
  }

  vipList(param, callback) {
    this.httpService.postFormData(this.api.vipList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  vipSave(param, callback) {
    this.httpService.postFormData(this.api.vipSave, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  vipDel(param, callback) {
    this.httpService.postFormData(this.api.vipDel, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  vipDetail(param, callback) {
    this.httpService.postFormData(this.api.vipDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  getElementInfo(param, callback) {
    this.httpService.postFormData(this.api.getElementInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  saveElement(param, callback) {
    this.httpService.postFormFile(this.api.saveElement, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  elementList(param, callback) {
    this.httpService.postFormData(this.api.elementList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  apkList(param, callback) {
    this.httpService.postFormData(this.api.apkList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  listPagePopup(param, callback) {
    this.httpService.postFormData(this.api.listPagePopup, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }


  apkSave(param, callback) {
    this.httpService.postFormData(this.api.apkSave, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  savePagePopup(param, callback) {
    this.httpService.postFormFile(this.api.savePagePopup, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  uploadAPK(param, callback) {
    this.httpService.postFormFile(this.api.uploadAPK, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
/*    this.httpService.postFormData(this.api.uploadAPK, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });*/
  }

  apkDetail(param, callback) {
    this.httpService.postFormData(this.api.apkDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  getPagePopupById(param, callback) {
    this.httpService.postFormData(this.api.getPagePopupById, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  getOTTItem(param, callback) {
    this.httpService.postFormData(this.api.getOTTItem , param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getOTTItemNew(param, callback) {
    this.httpService.postFormData(this.api.getOTTItemNew , param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  apkDel(param, callback) {
    this.httpService.postFormData(this.api.apkDel , param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  delPagePopup(param, callback) {
    this.httpService.postFormData(this.api.delPagePopup , param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  getOTTProduct(param, callback) {
    this.httpService.postFormData(this.api.getOTTProduct , param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }

}
