import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';

@Injectable()
export class OrderBusinessService {
  constructor(private httpService: HttpService, private toastService: ToastService) { }
  api: any = {
    orderList: "/busi/orderrule/getList",
    nodeDetail: "/busi/node/nodedetail",
    templateStyle: "/busi/templateStyle/getAllTemplateImg",
    allProduct: "/busi/nodeManager/getAllProduct",
    allPri: "/busi/node/nodedetailProvince",
    allPro: "/busi/node/nodedetailProvinceProduct",
    provinces: "/busi/ruleNodeManager/getProvinces",
    cities: "/busi/nodeManager/getCitys",
    updateStatus: "/busi/orderrule/update/status",
    delOrderRule: "/busi/orderrule/delOrderRule",
    getProductList: "/busi/product/getList",
    getCurNodePro: "/busi/orderrule/getNodeDetail",
    getCurCitys: "/busi/orderrule/getCitys",
    saveOrderRule: "/busi/orderrule/addOrderRule",
    editOrderRule: "/busi/orderrule/editOrderRule",
    relateList: "/busi/nodeManager/getList",
    productList: "/busi/productInfo/getList",
    productListNew: "/busi/productInfo/getListNew",
    addRelate: "/busi/nodeManager/addNode",
    editRelate: "/busi/nodeManager/editNode",
    detailRelate: "/busi/nodeManager/getNodeDetail",
    addProduct: "/busi/productInfo/addProduct",
    addProductNew: "/busi/productInfo/editRuleProductInfoNew",
    delProduct: "/busi/productInfo/delProduct",
    delProductNew: "/busi/productInfo/delProductNew",
    rurelateList: "/busi/ruleNodeManager/getList",
    addRurelate: "/busi/ruleNodeManager/addNode",
    editRurelate: "/busi/ruleNodeManager/editNode",
    editRure: "/busi/nodeManager/editNode",
    rurelateDetail: "/busi/ruleNodeManager/getNodeDetail",
    getOrderRuleDetail: "/busi/orderrule/getOrderRule",
    //新增风格图片列表
    addPicture: "/busi/templateImg/save",
    getDiyOrderTemplateList: "/busi/templateImg/getDiyOrderTemplateList",
    templateImgSave: "/busi/templateImg/save",
    uploadPicPost: "/busi/templateImg/upload",
    uploadFiles: "/busi/templateImg/uploadFiles",
    getTemplateImgByStyleCode: "/busi/templateImg/getTemplateImgByStyleCode",
    //订购模板图片风格列表
    pictureList: "/busi/templateImg/getList",
    delTemplateImg: "/busi/templateImg/delTemplateImg",
    // 大盘订购
    orderGrailList: "/busi/orderGrail/getList",
    getNodeDetailApi: "/busi/productSkip/getNodeDetail",
    addOrderGrail: "/busi/orderGrail/addOrderGrail",
    editOrderGrail: "/busi/orderGrail/updateOrderGrail",
    detailsGrail: "/busi/orderGrail/getOrderGrailById",
    delOrderGrail: "/busi/orderGrail/delOrderGrail",
    updateGrailStatus: "/busi/orderGrail/stopOrstart",

    //模板风格配置
    templateStyleList: "/busi/templateStyle/getList",
    getTemplateStyleEntityById: "/busi/templateStyle/getTemplateStyleEntityById",
    saveTemplate: "/busi/templateStyle/save",
    delTemplateStyle: "/busi/templateStyle/delTemplateStyle",
    templateStyleAllCode: "/busi/templateStyle/getAllCode",
    isEnable: "/busi/templateStyle/isEnable",
    // 活动管理
    getCodeList: "/busi/goCode/getList",
    getGoCodeById: "/busi/goCode/getGoCodeById",
    saveCode: "/busi/goCode/save",
    delGoCode: "/busi/goCode/delGoCode",
    // 专辑管理
    getalbumList: "/busi/albumCode/getList",
    getAlbumCodeById: "/busi/albumCode/getAlbumCodeById",
    saveAlbum: "/busi/albumCode/save",
    delAlbumCode: "/busi/albumCode/delAlbumCode",

    // 带有权限接口调整
    nodedetailAuth: "/busi/node/nodedetailAuth",
    getAllProductAuth: "/busi/nodeManager/getAllProductAuth",
    getProvincesAuth: "/busi/ruleNodeManager/getProvincesAuth",
    // 全局基础数据管理

    itemInfoList: "/busi/database/project/getAllProject",
    itemAdd: "/busi/database/project/addProject",
    itemUpdate: "/busi/database/project/updateProject",
    itemDetial: "/busi/database/project/getProjectByIProjectId",

    nodeInfoList: "/busi/database/node/getAllNodeCode",
    nodeAdd: "/busi/database/node/addNode",
    nodeUpdate: "/busi/database/node/updateNode",
    nodeDetial: "/busi/database/node/getNodeByCode",

    proNodeList: "/busi/database/projectNode/getAllprojectNode",
    proNodeAdd: "/busi/database/projectNode/addProjectNode",
    proNodeUpdate: "/busi/database/projectNode/updateProjectNode",
    proNodeDetial: "/busi/database/projectNode/getProjectNodeByCode",
    getAllProvinces: "/busi/productArea/getProvinces",
    // 数据管理1.2
    getProjectInfoList: "/busi/node/getProjectInfoList",
    listProjectProvinceProduce: "/busi/projectProvinceProduce/listProjectProvinceProduce",
    editProjectProvinceProduce: "/busi/projectProvinceProduce/editProjectProvinceProduce",
    detailProjectProvinceProduce: "/busi/projectProvinceProduce/detailProjectProvinceProduce",
    delProjectProvinceProduce: "/busi/projectProvinceProduce/delProjectProvinceProduce",
    getAllProjectInfoList: "/busi/node/getAllProjectInfoList",
    projectDetailNew: "/busi/productInfo/detailRuleProductInfoNew",

    // 优化3.0--2018/9/26
    projectAuth: "/busi/database/project/projectAuth",
    projectProvince: "/busi/database/project/projectProvince",
    projectProvinceProduct: "/busi/database/project/projectProvinceProduct",
    getProvincesNew: "/busi/projectProvinceProduce/getProvince",


    productAuth: "/busi/searchProduct/getAllProductAuth",
  }


  getAllProductAuthNew(param, callback) {
    this.httpService.postFormData(this.api.productAuth, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  // 数据管理3.0 - 2018/09/26
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
  // 数据管理1.2
  getProjectInfoList(param, callback) {
    this.httpService.postFormData(this.api.getProjectInfoList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  getAllProjectInfoList(param, callback) {
    this.httpService.postFormData(this.api.getAllProjectInfoList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  listProjectProvinceProduce(param, callback) {
    this.httpService.postFormData(this.api.listProjectProvinceProduce, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    });
  }
  editProjectProvinceProduce(param, callback) {
    this.httpService.postFormData(this.api.editProjectProvinceProduce, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    });
  }
  detailProjectProvinceProduce(param, callback) {
    this.httpService.postFormData(this.api.detailProjectProvinceProduce, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  delProjectProvinceProduce(param, callback) {
    this.httpService.postFormData(this.api.delProjectProvinceProduce, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  // 全局基础数据管理

  itemInfoList(param, callback) {
    this.httpService.postFormData(this.api.itemInfoList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  itemAdd(param, callback) {
    this.httpService.postFormData(this.api.itemAdd, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  itemUpdate(param, callback) {
    this.httpService.postFormData(this.api.itemUpdate, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  itemDetial(param, callback) {
    this.httpService.postFormData(this.api.itemDetial, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }


  nodeInfoList(param, callback) {
    this.httpService.postFormData(this.api.nodeInfoList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  nodeAdd(param, callback) {
    this.httpService.postFormData(this.api.nodeAdd, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  nodeUpdate(param, callback) {
    this.httpService.postFormData(this.api.nodeUpdate, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  nodeDetial(param, callback) {
    this.httpService.postFormData(this.api.nodeDetial, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }


  proNodeList(param, callback) {
    this.httpService.postFormData(this.api.proNodeList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  proNodeAdd(param, callback) {
    this.httpService.postFormData(this.api.proNodeAdd, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  proNodeUpdate(param, callback) {
    this.httpService.postFormData(this.api.proNodeUpdate, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  proNodeDetial(param, callback) {
    this.httpService.postFormData(this.api.proNodeDetial, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  getAllProvinces(param, callback) {
    this.httpService.postFormData(this.api.getAllProvinces, param, function (successful, data, res) {
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
  templateStyleAllCode(param, callback) {
    this.httpService.postFormData(this.api.templateStyleAllCode, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  isEnable(param, callback) {
    this.httpService.postFormData(this.api.isEnable, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  orderListPost(param, callback) {
    this.httpService.postFormData(this.api.orderList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  orderGrailList(param, callback) {
    this.httpService.postFormData(this.api.orderGrailList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  templateStyleList(param, callback) {
    this.httpService.postFormData(this.api.templateStyleList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  getCodeList(param, callback) {
    this.httpService.postFormData(this.api.getCodeList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  getGoCodeById(param, callback) {
    this.httpService.postFormData(this.api.getGoCodeById, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  saveCode(param, callback) {
    this.httpService.postFormData(this.api.saveCode, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  delGoCode(param, callback) {
    this.httpService.postFormData(this.api.delGoCode, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getalbumList(param, callback) {
    this.httpService.postFormData(this.api.getalbumList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  getAlbumCodeById(param, callback) {
    this.httpService.postFormData(this.api.getAlbumCodeById, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  saveAlbum(param, callback) {
    this.httpService.postFormData(this.api.saveAlbum, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  delAlbumCode(param, callback) {
    this.httpService.postFormData(this.api.delAlbumCode, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  relateListPost(param, callback) {
    this.httpService.postFormData(this.api.relateList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  rurelateListPost(param, callback) {
    this.httpService.postFormData(this.api.rurelateList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  rurelateDetailPost(param, callback) {
    this.httpService.postFormData(this.api.rurelateDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  productListPost(param, callback) {
    this.httpService.postFormData(this.api.productList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  productListNewPost(param, callback) {
    this.httpService.postFormData(this.api.productListNew, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  getNodeDetail(callback) {
    this.httpService.postFormData(this.api.nodeDetail, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  // 调整为带有权限
  getNodeDetailAuth(callback) {
    this.httpService.postFormData(this.api.nodedetailAuth, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  projectAuth(callback) {
    this.httpService.postFormData(this.api.projectAuth, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  templateStyle(callback) {
    this.httpService.postFormData(this.api.templateStyle, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getAllProduct(callback) {
    this.httpService.postFormData(this.api.allProduct, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getAllProductParam(param, callback) {
    this.httpService.postFormData(this.api.allProduct, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  // 调整为带有权限
  getAllProductAuth(callback) {
    this.httpService.postFormData(this.api.getAllProductAuth, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getProvinces(callback) {
    this.httpService.postFormData(this.api.provinces, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getProvincesNew(param, callback) {
    this.httpService.postFormData(this.api.getProvincesNew, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  // 调整为带有权限
  getProvincesAuth(callback) {
    this.httpService.postFormData(this.api.getProvincesAuth, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getDiyOrderTemplateList(callback) {
    this.httpService.postFormData(this.api.getDiyOrderTemplateList, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  templateImgSave(param, callback) {
    this.httpService.postFormData(this.api.templateImgSave, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  uploadPicPrePost(param, callback) {
    this.httpService.postFormFile(this.api.uploadPicPost, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }
  uploadFiles(param, callback) {
    this.httpService.postFormFile(this.api.uploadFiles, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    },  false);
  }
  getTemplateImgByStyleCode(param, callback) {
    this.httpService.postFormData(this.api.getTemplateImgByStyleCode, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }
  getCitys(callback) {
    this.httpService.postFormData(this.api.cities, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  updateStatus(param, callback) {
    this.httpService.postFormData(this.api.updateStatus, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  updateGrailStatus(param, callback) {
    this.httpService.postFormData(this.api.updateGrailStatus, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  delOrderRule(param, callback) {
    this.httpService.postFormData(this.api.delOrderRule, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  delOrderGrail(param, callback) {
    this.httpService.postFormData(this.api.delOrderGrail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  delTemplateImg(param, callback) {
    this.httpService.postFormData(this.api.delTemplateImg, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  delTemplateStyle(param, callback) {
    this.httpService.postFormData(this.api.delTemplateStyle, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  getProductList(param, callback) {
    this.httpService.postFormData(this.api.getProductList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  addRelatePost(param, callback) {
    this.httpService.postFormData(this.api.addRelate, param, function (successful, data, res) {
      let message = '';
      message = data.msg;
      if (successful) {
        callback(message);
      }
    }, function (successful, msg, err) {
    });
  }
  editRelatePost(param, callback) {
    this.httpService.postFormData(this.api.editRelate, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  detailRelatePost(param, callback) {
    this.httpService.postFormData(this.api.detailRelate, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  addRurelatePost(param, callback) {
    this.httpService.postFormData(this.api.addRurelate, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  editRurelatePost(param, callback) {
    this.httpService.postFormData(this.api.editRurelate, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  editRurePost(param, callback) {
    this.httpService.postFormData(this.api.editRure, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  addProductPost(param, callback) {
    this.httpService.postFormData(this.api.addProduct, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  addProductNewPost(param, callback) {
    this.httpService.postFormData(this.api.addProductNew, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  projectDetailNew(param, callback) {
    this.httpService.postFormData(this.api.projectDetailNew, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  delProductPost(param, callback) {
    this.httpService.postFormData(this.api.delProduct, param, function (successful, data, res) {
      let message = '';
      message = data.msg;
      if (successful) {
        callback(message);
      }
    }, function (successful, msg, err) {
    });
  }
  delProductNewPost(param, callback) {
    this.httpService.postFormData(this.api.delProductNew, param, function (successful, data, res) {
      let message = '';
      message = data.msg;
      if (successful) {
        callback(message);
      }
    }, function (successful, msg, err) {
    });
  }

  getCurNodePro(param, callback) {
    this.httpService.postFormData(this.api.getCurNodePro, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getCurNodeProduct(param, callback) {
    this.httpService.postFormData(this.api.allProduct, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getallPro(param, callback) {
    this.httpService.postFormData(this.api.allPro, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getallPri(param, callback) {
    this.httpService.postFormData(this.api.allPri, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getCurNodeProvious(param, callback) {
    this.httpService.postFormData(this.api.provinces, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getCurCitys(param, callback) {
    this.httpService.postFormData(this.api.getCurCitys, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  saveOrderRule(param, callback) {
    this.httpService.postFormData(this.api.saveOrderRule, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  editOrderRule(param, callback) {
    this.httpService.postFormData(this.api.editOrderRule, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  addOrderGrail(param, callback) {
    this.httpService.postFormData(this.api.addOrderGrail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  editOrderGrail(param, callback) {
    this.httpService.postFormData(this.api.editOrderGrail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  saveTemplate(param, callback) {
    this.httpService.postFormData(this.api.saveTemplate, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getOrderRuleDetail(param, callback) {
    this.httpService.postFormData(this.api.getOrderRuleDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getTemplateStyleEntityById(param, callback) {
    this.httpService.postFormData(this.api.getTemplateStyleEntityById, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

 /**
   * @description 新增风格图片
   */

  detailsGrail(param, callback) {
    this.httpService.postFormData(this.api.detailsGrail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  addPicture(param, callback) {
    this.httpService.postFormData(this.api.addPicture, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  /**
   * @description 订购模板风格图片列表
   */
  pictureList(param, callback) {
    this.httpService.postFormData(this.api.pictureList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

}
