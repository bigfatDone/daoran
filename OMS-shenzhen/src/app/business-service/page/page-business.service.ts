import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { environment } from '../../../environments/environment';
import {Router} from '@angular/router';


@Injectable()
export class PageBusinessService {
  api: any;
  windowUrl: any;
  constructor(private httpService: HttpService, private toastService: ToastService, private router: Router) {
    this.windowUrl = this.router.url;
    if ( this.windowUrl.indexOf("/draw/") < 0) {
      this.api = {
        nodeDetail: "/busi/node/nodedetail",
        eleList: "/busi/element/list",
        pageList:"/busi/page/list",
        pageListForElement:"/busi/page/listForElement",
        pageAlbumList:"/busi/special/list",
        pageDetail:"/busi/page/getPage",
        eleAdd: "/busi/element/save",
        eleDel: "/busi/element/delete",
        eleDetail: "/busi/element/getElement",
        elePreDetail: "/busi/element/getPreElementById",
        getElePageVal: "/busi/element/elepage",
        // getElePageVal: "/busi/element/elepageNew",
        // getEleListVal: "/busi/element/elelist",
        getEleListVal: "/busi/element/elelistNew",
        // getEleResVal: "/busi/element/eleres",
        getEleResVal: "/busi/element/eleresNew",
        getEleAlbVal: "/busi/element/elealbum",
        // getEleAlbVal: "/busi/element/elealbumNew",
        getEleWallVal: "/busi/picturewall/getPictureWallList",
        getEleAlbumVal: "/busi/element/albumlist",
        elePageList: "/busi/element/pagelist",
        eleVlist: "/busi/element/listlist",
        eleArtlist: "/busi/element/artlist",
        eleResList: "/busi/element/reslist",
        pageAdd: "/busi/page/save",
        pageAddNew: "/busi/page/saveNew",
        pageCopy: "/busi/page/copy",
        pageDel: "/busi/page/delete",
        getProductNameList: "/busi/productInfo/getAllProduct",
        getPageProductList: "/busi/pageproduct/list",
        uploadPic: "/busi/element/upload",
        uploadProductPage: "/busi/pageproduct/save",
        getPageProductRelationApi: "/busi/pageproduct/relation",
        delPageProductRelationApi: "/busi/pageproduct/delete",
        getEleList: "/busi/element/elelist",
        delRelationPartApi: "/busi/element/partElement/delete",
        getRelationApi: "/busi/element/getRelation",
        partElementSaveApi: "/busi/element/partElement/save",
        partElementRelate: "/busi/element/haspartelement",
        getPreList: "/busi/element/getListPreElement",
        delPreinsert: "/busi/element/del/elementInfoPreinsert",
        addPreinsert: "/busi/element/add/elementInfoPreinsert",
        uploadPrePic: "/busi/element/uploadPre",
        // 页面修改排序
        sortElement: "/busi/page/sortElement",
        // 标签关联
        getLabelType: "/busi/label/getLabelType",
        getLabelList: "/busi/label/getLabelList",
        getLabelResource: "/busi/label/getLabelResource",
        getLabelResourcePro: "/busi/label/getLabelPlayBill",
        getLabelResourceAlb: "/busi/label/getLabelAlbum",

        // 调整为带权限
        projectAuth: "/busi/database/project/projectAuth",
        getAllProductAuth: "/busi/nodeManager/getAllProductAuth",

        // 无权限省份
        getProductNoAuth: "/busi/ruleNodeManager/getProvinces",

        allPri: "/busi/ruleNodeManager/getProvincesAuthNew",
        getCurCitys: "/busi/orderrule/getCitys",
        copyDetial: "/busi/page/copyDetial",

        // 图片删除
        deleteImage: "/busi/element/deleteImageABC",
        // 页面指向
        UnionList: "/busi/page/getUnionList",
        // 获取安卓值
        androidVal: "/busi/element/elementValueList",



        searchProAuth: "/busi/searchProduct/getAllProductAuth",
      };
    }else if ( this.windowUrl.indexOf("/draw/") >= 0 ) {
      this.api = {
        nodeDetail: "/busi/node/nodedetail",
        eleList: "/busi/hdbelement/getList",
        pageList:"/busi/hdbview/getList",
        pageListForElement:"/busi/hdbview/getList",
        pageDetail:"/busi/hdbview/getPage",
        eleAdd: "/busi/hdbelement/save/element",
        eleDel: "/busi/hdbelement/del/element",
        eleDetail: "/busi/hdbelement/getElement",
        getElePageVal: "/busi/element/elepage",
        getEleListVal: "/busi/element/elelist",
        getEleResVal: "/busi/hdbelement/getEleRes",
        elePageList: "/busi/hdbelement/getPageList",
        eleVlist: "/busi/hdbelement/getListList",
        eleArtlist: "/busi/element/artlist",
        eleResList: "/busi/element/reslist",
        pageAdd: "/busi/hdbview/save",
        pageAddNew: "/busi/hdbview/saveNew",
        pageCopy: "/busi/hdbview/copy",
        getProductNameList: "/busi/productInfo/getAllProduct",
        getPageProductList: "/busi/view/hdbpageproductManager/getList",
        uploadPic: "/busi/element/upload",
        uploadProductPage: "/busi/pageproduct/save",
        getPageProductRelationApi: "/busi/view/hdbpageproductManager/getRelation",
        delPageProductRelationApi: "/busi/pageproduct/delete",
        getEleList: "/busi/element/elelist",
        delRelationPartApi: "/busi/element/partElement/delete",
        getRelationApi: "/busi/hdbelement/getRelation",
        partElementSaveApi: "/busi/element/partElement/save",
        partElementRelate: "/busi/element/haspartelement",
        allPri: "/busi/ruleNodeManager/getProvincesAuthNew",
        getCurCitys: "/busi/orderrule/getCitys",
        copyDetial: "/busi/hdbview/copyDetial",
        getLabelType: "/busi/label/getLabelType",
        getLabelList: "/busi/label/getLabelList",
        getLabelResource: "/busi/label/getLabelResource",
        // 页面修改排序
        sortElement: "/busi/page/sortElement",

        // 图片删除
        deleteImage: "/busi/element/deleteImageABC",
        // 无权限省份
        getProductNoAuth: "/busi/ruleNodeManager/getProvinces",
        // 页面指向
        UnionList: "/busi/page/getUnionList",
        // 获取安卓值
        androidVal: "/busi/element/elementValueList",
        searchProAuth: "/busi/searchProduct/getAllProductAuth",
      };
    }
  }

  searchProAuth(param, callback) {
    this.httpService.postFormData(this.api.searchProAuth, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  // 获取安卓值
  androidVal(param, callback) {
    this.httpService.postFormData(this.api.androidVal, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  // 页面指向
  UnionList(param, callback) {
    this.httpService.postFormData(this.api.UnionList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  // 图片删除
  deleteImage(param, callback) {
    this.httpService.postFormData(this.api.deleteImage, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  // 调整为带权限

  projectAuth(callback) {
    this.httpService.postFormData(this.api.projectAuth, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
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
  getProductNoAuth(param, callback) {
    this.httpService.postFormData(this.api.getProductNoAuth, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  copyDetial(param, callback) {
    this.httpService.postFormData(this.api.copyDetial, param, function (successful, data, res) {
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

  getCurCitys(param, callback) {
    this.httpService.postFormData(this.api.getCurCitys, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }


  partElementSaveService(param, callback) { // 保存关联
    this.httpService.postFormData(this.api.partElementSaveApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getRelationService(param, callback) { // 关联list
    this.httpService.postFormData(this.api.getRelationApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  delRelationPartService(param, callback) { // 删除关联
    this.httpService.postFormData(this.api.delRelationPartApi, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  eleListPost(param, callback) {
    this.httpService.postFormData(this.api.eleList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  pageList(param, callback) {
    this.httpService.postFormData(this.api.pageList, param, function (successful, data, res) {

      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  pageListForElement(param, callback) {
    this.httpService.postFormData(this.api.pageListForElement, param, function (successful, data, res) {

      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  pageAlbumList(param, callback) {
    this.httpService.postFormData(this.api.pageAlbumList, param, function (successful, data, res) {

      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  pageDetail(param, callback) {
    this.httpService.postFormData(this.api.pageDetail, param, function (successful, data, res) {

      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }


  delete(param, callback) {
    this.httpService.postFormData(this.api.delete, param, function (successful, data, res) {
      callback(data);
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  eleAddPost(param, callback) {
    this.httpService.postFormFile(this.api.eleAdd, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  addPreinsertPost(param, callback) {
    this.httpService.postFormFile(this.api.addPreinsert, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }

  eleDetailPost(param, callback) {
    this.httpService.postFormData(this.api.eleDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  elePreDetailPost(param, callback) {
    this.httpService.postFormData(this.api.elePreDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getEleValPageData(param, callback) {
    this.httpService.postFormData(this.api.getElePageVal, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getEleValListData(param, callback) {
    this.httpService.postFormData(this.api.getEleListVal, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getEleValResData(param, callback) {
    this.httpService.postFormData(this.api.getEleResVal, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getEleValAlbData(param, callback) {
    this.httpService.postFormData(this.api.getEleAlbVal, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getEleValWallData(param, callback) {
    this.httpService.postFormData(this.api.getEleWallVal, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getEleValAlbumData(param, callback) {
    this.httpService.postFormData(this.api.getEleAlbumVal, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  eleDelPost(param, callback) {
    this.httpService.postFormData(this.api.eleDel, param, function (successful, data, res) {
      if (successful) {
        callback();
      }
    }, function (successful, msg, err) {
    });
  }

  elePageListPost(param, callback) {
    this.httpService.postFormData(this.api.elePageList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  eleVListPost(param, callback) {
    this.httpService.postFormData(this.api.eleVlist, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  eleArtListPost(param, callback) {
    this.httpService.postFormData(this.api.eleArtlist, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getEleResList(param, callback) {
    this.httpService.postFormData(this.api.eleResList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getProductName(param, callback) {
    this.httpService.postFormData(this.api.getProductNameList, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }

  pageAddPost(param, callback) {
    this.httpService.postFormData(this.api.pageAdd, param, function (successful, data, res) {
      if (successful) {
        callback( );
      }
    }, function (successful, msg, err) {
    });
  }
  pageAddNewPost(param, callback) {
    this.httpService.postFormFile(this.api.pageAddNew, param, function (successful, data, res) {
      if (successful) {
        callback( );
      }
    }, function (successful, msg, err) {
    });
  }
  sortElementPost(param, callback) {
    this.httpService.postFormData(this.api.sortElement, param, function (successful, data, res) {
      if (successful) {
        callback( );
      }
    }, function (successful, msg, err) {
    });
  }
  pageCopyPost(param, callback) {
    this.httpService.postFormData(this.api.pageCopy, param, function (successful, data, res) {
      if (successful) {
        callback( );
      }
    }, function (successful, msg, err) {
    });
  }
  pageDel(param, callback) {
    this.httpService.postFormData(this.api.pageDel, param, function (successful, data, res) {
      if (successful) {
        callback( );
      }
    }, function (successful, msg, err) {
    });
  }

  getPageProduct(param, callback) {
    this.httpService.postFormData(this.api.getPageProductList, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
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

  uploadPicPost(param, callback) {
    this.httpService.postFormFile(this.api.uploadPic, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }
  uploadPicPrePost(param, callback) {
    this.httpService.postFormFile(this.api.uploadPrePic, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  // getProductName(param, callback) {
  //   this.httpService.postFormData(this.api.getProductNameList, param, function (successful, data, res) {
  //     console.log('su')
  //     if (successful) {
  //       callback(data);
  //     }
  //   }, function (successful, msg, err) {
  //     // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
  //     // that.toastService.toast(toastCfg);
  //   });
  // }

  // getPageProduct(param, callback) {
  //   this.httpService.postFormData(this.api.getPageProductList, param, function (successful, data, res) {
  //     if (successful) {
  //       callback(data);
  //     }
  //   }, function (successful, msg, err) {
  //     // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
  //     // that.toastService.toast(toastCfg);
  //   });
  // }

  // uploadPicPost(param, callback) {
  //   this.httpService.postFormFile(this.api.uploadPic, param, function (successful, data, res) {
  //     if (successful) {
  //       callback(data);
  //     }
  //   }, function (successful, msg, err) {
  //     // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
  //     // that.toastService.toast(toastCfg);
  //   });
  // }
  saveProductPage(param, callback) {
    this.httpService.postFormData(this.api.uploadProductPage, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    });
  }

  getPageProductRelationService(param, callback) {
    this.httpService.postFormData(this.api.getPageProductRelationApi, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }

  delPageProductRelationService(param, callback) {
    this.httpService.postFormData(this.api.delPageProductRelationApi, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
      // const toastCfg = new ToastConfig(ToastType.ERROR, '', msg, 3000);
      // that.toastService.toast(toastCfg);
    }, false);
  }

  getEleList(param, callback) {
    this.httpService.postFormData(this.api.getEleList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getPartRelate(param, callback) {
    this.httpService.postFormData(this.api.partElementRelate, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getPreList(param, callback) {
    this.httpService.postFormData(this.api.getPreList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  elePrePost(param, callback) {
    this.httpService.postFormData(this.api.delPreinsert, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  // 标签关联
  getLabelType(callback) {
    this.httpService.postFormData(this.api.getLabelType, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getLabelList(param, callback) {
    this.httpService.postFormData(this.api.getLabelList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getLabelResource(param, callback) {
    this.httpService.postFormData(this.api.getLabelResource, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getLabelResourcePro(param, callback) {
    this.httpService.postFormData(this.api.getLabelResourcePro, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getLabelResourceAlb(param, callback) {
    this.httpService.postFormData(this.api.getLabelResourceAlb, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
}

