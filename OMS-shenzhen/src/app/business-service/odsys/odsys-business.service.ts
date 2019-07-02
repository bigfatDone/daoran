import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';

@Injectable()
export class OdsysBusinessService {
  constructor(private httpService: HttpService, private toastService: ToastService) { }
  api: any = {
    orderProcode: "/busi/orderProcode/getList",
    orderProcode_del: "/busi/orderProcode/delete",
    orderProcode_save: "/busi/orderProcode/save",
    getProjects: "/busi/orderProcode/getAllProduct",
    getProjectsDetail: "/busi/orderProcode/getOrdercode",
    getProducts: "/busi/orderProcode/getOwnProductInfoEntities",
    getProvinces: "/busi/ruleNodeManager/getProvinces",
    getTemList: "/busi/orderTemplate/getList",
    saveTmpInfo: "/busi/orderTemplate/save",
    delTmpInfo: "/busi/orderTemplate/delete",
    getTmpDetail: "/busi/orderTemplate/getOrderTemplate",
    getTmpConfig: "/busi/templateDeploy/getList",
    saveTmpConfig: "/busi/templateDeploy/save",
    getTemplateList: "/busi/templateDeploy/getTemplateList",
    deleteTmpConfig: "/busi/templateDeploy/delete",
    getTmpConfigDetail: "/busi/templateDeploy/getTemplateDeploy",

    //订购配置管理-内部计费产品配置
    ownProductList: "/busi/ownProduct/getList",
    ownProductEdit: "/busi/ownProduct/edit",
    ownProductDetail: "/busi/ownProduct/detail",
    ownProductDel: "/busi/ownProduct/delete",
    //订购配置管理-外部计费产品配置
    ttpProductList: "/busi/ttpProduct/getList",
    ttpProductEdit: "/busi/ttpProduct/edit",
    ttpProductDetail: "/busi/ttpProduct/detail",
    ttpProductDel: "/busi/ttpProduct/delete",
    //订购配置管理-内外计费产品配置
    productOwnTipList: "/busi/productOwnTip/getList",
    productOwnTipEdit: "/busi/productOwnTip/save",
    productOwnTipDetail: "/busi/productOwnTip/getProductOwnTip",
    productOwnTipDel: "/busi/productOwnTip/deletProductOwnTip",
    //订购配置管理-外部计费产品配置
    orderList: "/busi/tprOrderProcode/getList",
    orderEdit: "/busi/tprOrderProcode/save",
    orderDetail: "/busi/tprOrderProcode/getTprOrderProcode",
    orderDel: "/busi/tprOrderProcode/deletTprOrderProcode",
    nodedetail: "/busi/node/nodedetail",
    getAllProject: "/busi/database/project/getAllProject",
    getNodeList: "/busi/act/awardInfo/getNodeList",
  }
  getNodeList(param, callback) {
    this.httpService.postFormData(this.api.getNodeList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getNodeDetail(callback) {
    this.httpService.postFormData(this.api.nodedetail, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getAllProject(callback) {
    this.httpService.postFormData(this.api.getAllProject, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  //订购配置管理
  ownProductList(param, callback) {
    this.httpService.postFormData(this.api.ownProductList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  ownProductEdit(param, callback) {
    this.httpService.postFormData(this.api.ownProductEdit, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  ownProductDetail(param, callback) {
    this.httpService.postFormData(this.api.ownProductDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  ownProductDel(param, callback) {
    this.httpService.postFormData(this.api.ownProductDel, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  ttpProductList(param, callback) {
    this.httpService.postFormData(this.api.ttpProductList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  ttpProductEdit(param, callback) {
    this.httpService.postFormData(this.api.ttpProductEdit, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  ttpProductDetail(param, callback) {
    this.httpService.postFormData(this.api.ttpProductDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  ttpProductDel(param, callback) {
    this.httpService.postFormData(this.api.ttpProductDel, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  productOwnTipList(param, callback) {
    this.httpService.postFormData(this.api.productOwnTipList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  productOwnTipEdit(param, callback) {
    this.httpService.postFormData(this.api.productOwnTipEdit, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  productOwnTipDetail(param, callback) {
    this.httpService.postFormData(this.api.productOwnTipDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  productOwnTipDel(param, callback) {
    this.httpService.postFormData(this.api.productOwnTipDel, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  orderList(param, callback) {
    this.httpService.postFormData(this.api.orderList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  orderEdit(param, callback) {
    this.httpService.postFormData(this.api.orderEdit, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  orderDetail(param, callback) {
    this.httpService.postFormData(this.api.orderDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  orderDel(param, callback) {
    this.httpService.postFormData(this.api.orderDel, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }


  orderProcodePost(param, callback) {
    this.httpService.postFormData(this.api.orderProcode, param, function (successful, data, res) {
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
        // data.obj.unshift({iAreaId: 0, iParentId: 0, sAreaCode: "100", sAreaName: "全国", state: 0});
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

  saveTmpInfo(param, callback) {
    this.httpService.postFormData(this.api.saveTmpInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  delTmpInfo(param, callback) {
    this.httpService.postFormData(this.api.delTmpInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getTmpDetail(param, callback) {
    this.httpService.postFormData(this.api.getTmpDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getTmpConfig(param, callback) {
    this.httpService.postFormData(this.api.getTmpConfig, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  saveTmpConfig(param, callback) {
    this.httpService.postFormData(this.api.saveTmpConfig, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  getTemplateList(param, callback) {
    this.httpService.postFormData(this.api.getTemplateList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  deleteTmpConfig(param, callback) {
    this.httpService.postFormData(this.api.deleteTmpConfig, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  getTmpConfigDetail(param, callback) {
    this.httpService.postFormData(this.api.getTmpConfigDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

}
