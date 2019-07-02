import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';
// import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
// import { environment } from '../../../environments/environment';


@Injectable()
export class JumpBusinessService {

  constructor(private httpService: HttpService, private toastService: ToastService) { }

  api: any = {
    productSkipList: "/busi/productSkip/getList",
    getProductNameApi: "/busi/productInfo/getAllProduct",
    getNodeCodeApi: "/busi/node/nodedetail",
    getProvincesApi: "/busi/ruleNodeManager/getProvinces",
    delProductSkipApi: "/busi/productSkip/delProductSkip",
    startOrPauseProductSkipApi: "/busi/productSkip/update/status",
    getNodeDetailApi: "/busi/productSkip/getNodeDetail",
    getPageListApi: "/busi/element/list",
    entermanageListApi: "/busi/entermanage/getList",
    getProjectsApi: "/busi/entermanage/getProjects",
    getProductsApi: "/busi/productArea/getProducts",
    getSlevel1Api: "/busi/entermanage/getSlevel1List",
    getCitysApi: "/busi/productSkip/getCitys",
    addProductSkipApi: "/busi/productSkip/addProductSkip",
    editProductSkipApi: "/busi/productSkip/editProductSkip",

    // 带有权限接口调整
    nodedetailAuth: "/busi/node/nodedetailAuth",
    getAllProductAuth: "/busi/productInfo/getAllProductAuth",
    getProvincesAuth: "/busi/ruleNodeManager/getProvincesAuth",

    // 优化3.0--2018/9/26
    projectAuth: "/busi/database/project/projectAuth",
    projectProvince: "/busi/ruleNodeManager/getProvincesAuth",
    projectProvinceProduct: "/busi/nodeManager/getAllProductAuth",
  };

  projectAuth(param, callback) {
    this.httpService.postFormData(this.api.projectAuth, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  projectProvince(param, callback) {
    this.httpService.postFormData(this.api.projectProvince, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  projectProvinceProduct(param, callback) {
    this.httpService.postFormData(this.api.projectProvinceProduct, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  editProductSkipService(param, callback) { // 修改
    this.httpService.postFormData(this.api.editProductSkipApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  addProductSkipService(param, callback) { // 增加
    this.httpService.postFormData(this.api.addProductSkipApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getCitysService(param, callback) { // 获取城市
    this.httpService.postFormData(this.api.getCitysApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getSlevel1Service(param, callback) { // 分类
    this.httpService.postFormData(this.api.getSlevel1Api, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getProductsService(param, callback) { // 指向对象
    this.httpService.postFormData(this.api.getProductsApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getProjectsService(param, callback) { // 运营商项目
    this.httpService.postFormData(this.api.getProjectsApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getEntermanageListService(param, callback) { // AccessIdList
    this.httpService.postFormData(this.api.entermanageListApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getPageListService(param, callback) {
    this.httpService.postFormData(this.api.getPageListApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getNodeDetailApiServce(param, callback) {
    this.httpService.postFormData(this.api.getNodeDetailApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  startOrPauseProductSkipServce(param, callback) {
    this.httpService.postFormData(this.api.startOrPauseProductSkipApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    });
  }

  delProductSkipServce(param, callback) {
    this.httpService.postFormData(this.api.delProductSkipApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    });
  }

  productSkipListPost(param, callback) {
    this.httpService.postFormData(this.api.productSkipList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    });
  }

  getProductName(param, callback) { // 产品名称列表
    this.httpService.postFormData(this.api.getProductNameApi, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  // 改为有权限的接口
  getProductAuth(param, callback) { // 产品名称列表
    this.httpService.postFormData(this.api.getAllProductAuth, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }

  getNodeCode(param, callback) { // 指定节点列表
    this.httpService.postFormData(this.api.getNodeCodeApi, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  // 改为由权限
  getNodeCodeAuth(param, callback) { // 指定节点列表
    this.httpService.postFormData(this.api.nodedetailAuth, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getProvinces(param, callback) { // 省份列表
    this.httpService.postFormData(this.api.getProvincesApi, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  // 改为有权限的接口
  getProvincesAuth(param, callback) { // 省份列表
    this.httpService.postFormData(this.api.getProvincesAuth, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }

}

