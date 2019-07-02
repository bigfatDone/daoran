import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import {Router} from '@angular/router';


@Injectable()
export class EntryBusinessService {
  api: any;
  windowUrl: any;
  modalType: String;

  constructor(private httpService: HttpService, private router: Router) {
    this.windowUrl = this.router.url;
    if ( this.windowUrl.indexOf("/entry/") >= 0 ) {
      this.api = {
        productList: "/busi/product/getList",
        productListNew: "/busi/hdbproduct/getListNew",
        projectList: "/busi/project/getList",
        // productAreaList: "/busi/productArea/getProducts",
        productAreaList: "/busi/nodeManager/getAllProductAuth",
        entermanageList: "/busi/entermanage/getList",
        addProduct: "/busi/product/addProduct",
        editProduct: "/busi/product/editProduct",
        detailProduct: "/busi/product/getProductInfo",
        delProduct: "/busi/product/delProduct",
        getAllProduct: "/busi/project/getAllProduct",
        getProductOptionList: "/busi/productInfo/getProductOptionList",
        getVersionList: "/busi/productInfo/getVersionList",
        editProject: "/busi/project/editProject",
        addProject: "/busi/project/addProject",
        getProjectInfo: "/busi/project/getProjectInfo",
        getRelateProjects: "/busi/entermanage/getProjects",
        getRelateList: "/busi/productArea/getList",
        saveRelateList: "/busi/productArea/addProduct",
        editProductArea: "/busi/productArea/editProductArea",
        // getProvinces: "/busi/productArea/getProvinces",
        getProvinces: "/busi/ruleNodeManager/getProvincesAuth",
        getRelateInfo: "/busi/productArea/getProjectInfo",
        delRelate: "/busi/productArea/delProduct",
        getSlevel1Api: "/busi/entermanage/getSlevel1List",
        delEnterManageApi: "/busi/entermanage/delEnterManage",
        getEnterManageInfoApi: "/busi/entermanage/getEnterManageInfo",
        getProjectDetailApi: "/busi/entermanage/getProjectDetail",
        getProductDetailApi: "/busi/entermanage/getProductDetail",
        getEnterProvinceApi: "/busi/entermanage/getProvinces",
        getProvinceDetailApi: "/busi/entermanage/getProvinceDetail",
        getSlevel1DetailApi: "/busi/entermanage/getSlevel1Detail",
        addEnterManageApi: "/busi/entermanage/addEnterManage",
        editEnterManageApi: "/busi/entermanage/saveEnterManage",
        getKindListApi: "/busi/entermanage/getAllSlevelAndValueList",
        addLevel1Api: "/busi/entermanage/addLevel1",
        editLevel1Api: "/busi/entermanage/editLevel1",
        addLevelValuelApi: "/busi/entermanage/addLevelValue",
        editLevelValueApi: "/busi/entermanage/editLevelValue",

        // 带权限接口修改
        getRelateProjectsAuth: "/busi/entermanage/getProjectsAuth",
        // 数据优化第一期第二阶段
        getAllProjectInfoList: "/busi/node/getAllProjectInfoList",
        // 优化3.0--2018/9/26
        projectAuth:         "/busi/database/project/projectAuth",
        getEnterProvinces:   "/busi/entermanage/getProvinces",
        getEnterProductList: "/busi/entermanage/getProductList",
        getEnterVer:         "/busi/entermanage/getProductDetail",
        getEnterArea:        "/busi/entermanage/getProvinceDetail",

        // 关联管理新增省份
        getRelateProvinces:        "/busi/ruleNodeManager/getProvinces",
      };
    }else if ( this.windowUrl.indexOf("draw/visitList") >= 0 ) {
      this.api = {
        productList: "/busi/product/getList",
        projectList: "/busi/project/getList",
        productAreaList: "/busi/hdbproductArea/getProducts",
        entermanageList: "/busi/hdbentermanage/getList",
        addProduct: "/busi/product/addProduct",
        editProduct: "/busi/product/editProduct",
        detailProduct: "/busi/product/getProductInfo",
        delProduct: "/busi/product/delProduct",
        getAllProduct: "/busi/project/getAllProduct",
        editProject: "/busi/project/editProject",
        addProject: "/busi/project/addProject",
        getProjectInfo: "/busi/project/getProjectInfo",
        getRelateProjects: "/busi/hdbentermanage/getProjects",
        getRelateProjectsAuth: "/busi/hdbentermanage/getProjects",
        getRelateList: "/busi/productArea/getList",
        saveRelateList: "/busi/productArea/addProduct",
        editProductArea: "/busi/productArea/editProductArea",
        getProvinces: "/busi/productArea/getProvinces",
        getRelateInfo: "/busi/productArea/getProjectInfo",
        delRelate: "/busi/productArea/delProduct",
        getSlevel1Api: "/busi/hdbentermanage/getSlevel1List",
        delEnterManageApi: "/busi/hdbentermanage/delEnterManage",
        getEnterManageInfoApi: "/busi/hdbentermanage/getEnterManageInfo",
        getProjectDetailApi: "/busi/hdbproductArea/getProducts",
        getProductDetailApi: "/busi/entermanage/getProductDetail",
        getEnterProvinceApi: "/busi/hdbentermanage/getProvinceDetail",
        getProvinceDetailApi: "/busi/hdbentermanage/getProvinceDetail",
        getSlevel1DetailApi: "/busi/entermanage/getSlevel1Detail",
        addEnterManageApi: "/busi/hdbentermanage/addEnterManage",
        editEnterManageApi: "/busi/hdbentermanage/saveEnterManage",
        getKindListApi: "/busi/entermanage/getAllSlevelAndValueList",
        addLevel1Api: "/busi/entermanage/addLevel1",
        editLevel1Api: "/busi/entermanage/editLevel1",
        addLevelValuelApi: "/busi/entermanage/addLevelValue",
        editLevelValueApi: "/busi/entermanage/editLevelValue",

        // 优化3.0--2018/9/26 手绘本接口不变
        projectAuth:         "/busi/database/project/projectAuth",
        getEnterProvinces:   "/busi/productArea/getProvinces",
        getEnterProductList: "/busi/entermanage/getProductList",
        getEnterVer:         "/busi/entermanage/getProductDetail",
        getEnterArea:        "/busi/entermanage/getProvinceDetail",
      };
    }
  }
  projectAuth(param, callback) {
    this.httpService.postFormData(this.api.projectAuth, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  getEnterProvinces(param, callback) {
    this.httpService.postFormData(this.api.getEnterProvinces, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  getEnterProductList(param, callback) {
    this.httpService.postFormData(this.api.getEnterProductList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  getEnterVer(param, callback) {
    this.httpService.postFormData(this.api.getEnterVer, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }
  getEnterArea(param, callback) {
    this.httpService.postFormData(this.api.getEnterArea, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getAllProjectInfoList(callback) { // 数据优化1.2
    this.httpService.postFormData(this.api.getAllProjectInfoList, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  editLevelValueService(param, callback) { // 修改分类值
    this.httpService.postFormData(this.api.editLevelValueApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  addLevelValuelService(param, callback) { // 新增分类值
    this.httpService.postFormData(this.api.addLevelValuelApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  editLevel1Service(param, callback) { // 修改分类入口
    this.httpService.postFormData(this.api.editLevel1Api, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  addLevel1Service(param, callback) { // 新增分类入口
    this.httpService.postFormData(this.api.addLevel1Api, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getKindListService(param, callback) { // 获取分类列表
    this.httpService.postFormData(this.api.getKindListApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  editEnterManageService(param, callback) { // 修改入口信息
    this.httpService.postFormData(this.api.editEnterManageApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  addEnterManageService(param, callback) { // 增加入口信息
    this.httpService.postFormData(this.api.addEnterManageApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getSlevel1DetailService(param, callback) { // add,edit获取分类值
    this.httpService.postFormData(this.api.getSlevel1DetailApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getProvinceDetailService(param, callback) { // add,edit获取地市
    this.httpService.postFormData(this.api.getProvinceDetailApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getEnterProvinceService(param, callback) { // add,edit获取省份
    this.httpService.postFormData(this.api.getEnterProvinceApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getProductDetailAeService(param, callback) { // add,edit指向对象
    this.httpService.postFormData(this.api.getProductDetailApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getProjectDetailService(param, callback) { // add,edit指向对象
    this.httpService.postFormData(this.api.getProjectDetailApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getEnterManageInfoService(param, callback) { // 单个详情
    this.httpService.postFormData(this.api.getEnterManageInfoApi, param, function (successful, data, res) {
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

  delEnterManageService(param, callback) { // 删除
    this.httpService.postFormData(this.api.delEnterManageApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
      console.log(err);
    }, false);
  }

  getProductListPost(param, callback) {
    this.httpService.postFormData(this.api.productList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  getProductListNewPost(param, callback) {
    this.httpService.postFormData(this.api.productListNew, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  getProjectListPost(param, callback) {
    this.httpService.postFormData(this.api.projectList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  getProductAreaListPost(param, callback) {
    this.httpService.postFormData(this.api.productAreaList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getEntermanageList(param, callback) {
    this.httpService.postFormData(this.api.entermanageList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  addProduct(param, callback) {
    this.httpService.postFormData(this.api.addProduct, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  editProduct(param, callback) {
    this.httpService.postFormData(this.api.editProduct, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getProductDetail(param, callback) {
    this.httpService.postFormData(this.api.detailProduct, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  delProduct(param, callback) {
    this.httpService.postFormData(this.api.delProduct, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  getAllProduct(callback) {
    this.httpService.postFormData(this.api.getAllProduct, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getProductOptionList(param, callback) {
    this.httpService.postFormData(this.api.getProductOptionList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getVersionList(param, callback) {
    this.httpService.postFormData(this.api.getVersionList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  addProject(param, callback) {
    this.httpService.postFormData(this.api.addProject, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  editProject(param, callback) {
    this.httpService.postFormData(this.api.editProject, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getProjectInfo(param, callback) {
    this.httpService.postFormData(this.api.getProjectInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getRelateProjects(param, callback) {
    this.httpService.postFormData(this.api.getRelateProjects, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getRelateProjectsAuth(param, callback) {
    this.httpService.postFormData(this.api.getRelateProjectsAuth, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getRelateList(param, callback) {
    this.httpService.postFormData(this.api.getRelateList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  saveRelateList(param, callback) {
    this.httpService.postFormData(this.api.saveRelateList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  editRelateList(param, callback) {
    this.httpService.postFormData(this.api.editProductArea, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getRelateProvinces(callback) {
    this.httpService.postFormData(this.api.getRelateProvinces, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getProvinces(callback) {
    this.httpService.postFormData(this.api.getProvinces, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getHdbProvinces(callback) {
    this.httpService.postFormData(this.api.getEnterProvinceApi, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getRelateInfo(param, callback) {
    this.httpService.postFormData(this.api.getRelateInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  delRelate(param, callback) {
    this.httpService.postFormData(this.api.delRelate, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
}
