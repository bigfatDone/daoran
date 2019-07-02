import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';

@Injectable()
export class SafetyBusinessService {
  constructor(private httpService: HttpService, private toastService: ToastService) { }
  api: any = {
    dealerList: "/sp/getList",
    orderProcode_del: "/busi/orderProcode/delete",
    orderProcode_save: "/busi/orderProcode/save",
    getProjects: "/busi/orderProcode/getAllProduct",
    getProjectsDetail: "/busi/orderProcode/getOrdercode",
    getProducts: "/busi/orderProcode/getOwnProductInfoEntities",
    getProvinces: "/busi/ruleNodeManager/getProvinces",
    getTemList: "/busi/orderTemplate/getList",
    isIdExist: "/sp/checkSpId",
    saveSp: "/sp/addSp",
    editSp: "/sp/editSp",
    delSp: "/sp/delSp",
    dealerDetail: "/sp/getSpByID",
    allotRoles: "/sp/getAllotRoles",
    allotIps: "/sp/getAllotIPs",
    addAllotRoles: "/sp/addAllotRoles",
    addAllotIP: "/sp/addAllotIP",
    delAllotRole: "/sp/delAllotRole",
    delAllotIPs: "/sp/delAllotIPs",
    getRoleList: "/role/getList",
    delRoleInfo: "/role/delRoleInfo",
    getRoleDetail: "/role/getRoleInfo",
    addRoleInfo: "/role/addRoleInfo",
    editRoleInfo: "/role/editRoleInfo",
    getAllotAPIs: "/role/getAllotAPIs",
    delAllotAPI: "/role/delAllotAPI",
    addAllotAPIs: "/role/addAllotAPIs",
    getApiList: "/apiInfo/getList",
    getApiInfo: "/apiInfo/getApiInfo",
    addApiInfo: "/apiInfo/addApiInfo",
    editApiInfo: "/apiInfo/editApiInfo",
    delApiInfo: "/apiInfo/delApiInfo",
  }

  getDealerList(param, callback) {
    this.httpService.postFormData(this.api.dealerList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  orderProcodeDelPost(param, callback) {
    this.httpService.postFormData(this.api.orderProcode_del, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  orderProcodeSavePost(param, callback) {
    this.httpService.postFormData(this.api.orderProcode_save, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getProjects(callback) {
    this.httpService.postFormData(this.api.getProjects, {}, function (successful, data, res) {
      if (successful) {
        data.obj.unshift({iProductId: 0, sProductName: "全部产品", sProductcode: "all", state: 0});
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getProjectsDetail(param, callback) {
    this.httpService.postFormData(this.api.getProjectsDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getProducts(param, callback) {
    this.httpService.postFormData(this.api.getProducts, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getProvinces(callback) {
    this.httpService.postFormData(this.api.getProvinces, {}, function (successful, data, res) {
      if (successful) {
        data.obj.unshift({iAreaId: 0, iParentId: 0, sAreaCode: "100", sAreaName: "全国", state: 0});
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getTemList(param, callback) {
    this.httpService.postFormData(this.api.getTemList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }


  isIdExist(param, callback) {
    this.httpService.postFormData(this.api.isIdExist, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  saveSp(param, callback) {
    this.httpService.postFormData(this.api.saveSp, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  editSp(param, callback) {
    this.httpService.postFormData(this.api.editSp, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  delSp(param, callback) {
    this.httpService.postFormData(this.api.delSp, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getDealerDetail(param, callback) {
    this.httpService.postFormData(this.api.dealerDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getAllotRoles(param, callback) {
    this.httpService.postFormData(this.api.allotRoles, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  addAllotRoles(param, callback) {
    this.httpService.postFormData(this.api.addAllotRoles, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  delAllotRole(param, callback) {
    this.httpService.postFormData(this.api.delAllotRole, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  delAllotIPs(param, callback) {
    this.httpService.postFormData(this.api.delAllotIPs, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getAllotIps(param, callback) {
    this.httpService.postFormData(this.api.allotIps, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  addAllotIP(param, callback) {
    this.httpService.postFormData(this.api.addAllotIP, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }

  getRoleList(param, callback) {
    this.httpService.postFormData(this.api.getRoleList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  delRoleInfo(param, callback) {
    this.httpService.postFormData(this.api.delRoleInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  addRoleInfo(param, callback) {
    this.httpService.postFormData(this.api.addRoleInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  editRoleInfo(param, callback) {
    this.httpService.postFormData(this.api.editRoleInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  getAllotAPIs(param, callback) {
    this.httpService.postFormData(this.api.getAllotAPIs, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  delAllotAPI(param, callback) {
    this.httpService.postFormData(this.api.delAllotAPI, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  addAllotAPIs(param, callback) {
    this.httpService.postFormData(this.api.addAllotAPIs, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  getApiList(param, callback) {
    this.httpService.postFormData(this.api.getApiList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  getApiInfo(param, callback) {
    this.httpService.postFormData(this.api.getApiInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  addApiInfo(param, callback) {
    this.httpService.postFormData(this.api.addApiInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  editApiInfo(param, callback) {
    this.httpService.postFormData(this.api.editApiInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  delApiInfo(param, callback) {
    this.httpService.postFormData(this.api.delApiInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getRoleDetail(param, callback) {
    this.httpService.postFormData(this.api.getRoleDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

}
