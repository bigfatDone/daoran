import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { Router } from '@angular/router';

@Injectable()
export class ActiveBusinessService {

  windowUrl: any;
  api: any;

  constructor(private httpService: HttpService, private router: Router) {
    this.windowUrl = this.router.url;
    // if (this.windowUrl.indexOf("/program/") >= 0 ) {
      this.api = {
      // 活动配置管理

        // 公用接口
        nodedetailAuth: "/busi/node/nodedetailAuth",// 获取节点
        getItemList: "/busi/act/awardInfo/getItemList",// 获取项目
        getProjectList: "/busi/act/relation/getProjectList",// 获取产品
        getActCodeList: "/busi/act/awardInfo/getActCodeList",// 获取活动
        getProductPro: "/busi/node/nodedetailProvinceProduct",// 获取产品
        getRelateProduct: "/busi/node/nodedetailProvinceProductNew",// 获取关联产品
        getRelatePri: "/busi/node/nodedetailProvince",// 获取关联省份
        getProvinces: "/busi/ruleNodeManager/getProvincesAuth",// 获取关联省份
        // 活动基本信息
        activeList: "/busi/act/activityInfo/list",
        activeSave: "/busi/act/activityInfo/save",
        activeUpdate: "/busi/act/activityInfo/update",
        activeDel: "/busi/act/activityInfo/del",
        activeDetail: "/busi/act/activityInfo/details",
        getProjects: "/busi/project/getProjects",
        getNodeByProject: "/busi/project/getNodeByProject",
        // 奖品基本信息
        awardList: "/busi/act/awardInfo/list",
        awardSave: "/busi/act/awardInfo/save",
        awardDel: "/busi/act/awardInfo/del",
        awardDetail: "/busi/act/awardInfo/details",
        // 节点产品信息
        projectList: "/busi/act/projectInfo/list",
        projectSave: "/busi/act/projectInfo/save",
        projectDel: "/busi/act/projectInfo/del",
        projectDetail: "/busi/act/projectInfo/details",
        projectDetailnew: "/busi/productInfo/detailRuleProductInfoNew",
        // 关联产品信息
        relationList: "/busi/act/relation/list",
        relationSave: "/busi/act/relation/save",
        relationDel: "/busi/act/relation/del",
        relationDetail: "/busi/act/relation/details",
        // 抽奖记录信息
        actRecordList: "/busi/actRecord/drawInfo/list",
        actRecordDel: "/busi/actRecord/drawInfo/del",
        actRecordDetail: "/busi/actRecord/drawInfo/details",
        actRecordSave: "/busi/actRecord/drawInfo/save",
        getPrizeList: "/busi/actRecord/drawInfo/getPrizeList",
        getPrizeInfoById: "/busi/actRecord/drawInfo/getPrizeInfoById",
        // 其余列表
        orderInfoList: "/busi/actRecord/orderInfo/list",
        userActivityInfoList: "/busi/actRecord/userActivityInfo/list",
        redPacketInfoList: "/busi/actRecord/redPacketInfo/list",

        // 优化3.0
        projectAuth: "/busi/database/project/projectAuth",
        getNodeList: "/busi/act/awardInfo/getNodeList",
        // redPacketInfoList: "/busi/actRecord/redPacketInfo/list",
      };
    }
  // }

  // 公共
  getNodeList (param, callback) {
    this.httpService.postFormData(this.api.getNodeList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  projectAuth (callback) {
    this.httpService.postFormData(this.api.projectAuth, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  nodedetailAuth (callback) {
    this.httpService.postFormData(this.api.nodedetailAuth, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getItemList(param, callback) {
    this.httpService.postFormData(this.api.getItemList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getProjectList(param, callback) {
    this.httpService.postFormData(this.api.getProjectList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getActCodeList(param, callback) {
    this.httpService.postFormData(this.api.getActCodeList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    },  false);
  }
  getRelateProduct(param, callback) {
    this.httpService.postFormData(this.api.getRelateProduct, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    },  false);
  }
  getRelatePri(param, callback) {
    this.httpService.postFormData(this.api.getRelatePri, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    },  false);
  }
  getProvinces(param, callback) {
    this.httpService.postFormData(this.api.getProvinces, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    },  false);
  }
  getProductPro(param, callback) {
    this.httpService.postFormData(this.api.getProductPro, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    },  false);
  }
  // 活动基本信息
  getActiveList(param, callback) {
    this.httpService.postFormData(this.api.activeList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  getActiveDetail(param, callback) {
    this.httpService.postFormData(this.api.activeDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }


  delActive(param, callback) {
    this.httpService.postFormData(this.api.activeDel, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  saveActive(param, callback) {
    this.httpService.postFormData(this.api.activeSave, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  updateActive(param, callback) {
    this.httpService.postFormData(this.api.activeUpdate, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getProjects(callback) {
    this.httpService.postFormData(this.api.getProjects, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getNodeByProject(param, callback) {
    this.httpService.postFormData(this.api.getNodeByProject, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  // 奖品基本信息
  getAwardList(param, callback) {
    this.httpService.postFormData(this.api.awardList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  getAwardDetail(param, callback) {
    this.httpService.postFormData(this.api.awardDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }


  delAward(param, callback) {
    this.httpService.postFormData(this.api.awardDel, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  saveAward(param, callback) {
    this.httpService.postFormData(this.api.awardSave, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  // 节点产品信息
  projectList(param, callback) {
    this.httpService.postFormData(this.api.projectList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  projectDetail(param, callback) {
    this.httpService.postFormData(this.api.projectDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  projectDetailNew(param, callback) {
    this.httpService.postFormData(this.api.projectDetailNew, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }


  projectDel(param, callback) {
    this.httpService.postFormData(this.api.projectDel, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  projectSave(param, callback) {
    this.httpService.postFormData(this.api.projectSave, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  // 关联产品信息
  relationList(param, callback) {
    this.httpService.postFormData(this.api.relationList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  relationDetail(param, callback) {
    this.httpService.postFormData(this.api.relationDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }


  relationDel(param, callback) {
    this.httpService.postFormData(this.api.relationDel, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  relationSave(param, callback) {
    this.httpService.postFormData(this.api.relationSave, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  // 抽奖记录信息
  actRecordList(param, callback) {
    this.httpService.postFormData(this.api.actRecordList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  actRecordDetail(param, callback) {
    this.httpService.postFormData(this.api.actRecordDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }


  actRecordDel(param, callback) {
    this.httpService.postFormData(this.api.actRecordDel, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  actRecordSave(param, callback) {
    this.httpService.postFormData(this.api.actRecordSave, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getPrizeList(param, callback) {
    this.httpService.postFormData(this.api.getPrizeList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getPrizeInfoById(param, callback) {
    this.httpService.postFormData(this.api.getPrizeInfoById, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  // 其余列表
  orderInfoList(param, callback) {
    this.httpService.postFormData(this.api.orderInfoList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  userActivityInfoList(param, callback) {
    this.httpService.postFormData(this.api.userActivityInfoList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  redPacketInfoList(param, callback) {
    this.httpService.postFormData(this.api.redPacketInfoList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }


  getNodeDetail(callback) {
    this.httpService.postFormData(this.api.nodeDetail, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getNodes(callback) {
    this.httpService.postFormData(this.api.getNodes, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getResList(param, callback) {
    this.httpService.postFormData(this.api.resList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getartistList(param, callback) {
    this.httpService.postFormData(this.api.artistList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getSelectNodePoints(param, callback) {
    this.httpService.postFormData(this.api.getNodeCodes, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  saveResList(param, callback) {
    this.httpService.postFormData(this.api.addrestoalbum, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  saveArtisttoalbum(param, callback) {
    this.httpService.postFormData(this.api.addartisttoalbum, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getListResDetail(param, callback) {
    this.httpService.postFormData(this.api.albumres, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getListalbumArtistDetail(param, callback) {
    this.httpService.postFormData(this.api.albumArtist, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  listresByWhere(param, callback) {
    this.httpService.postFormData(this.api.listresByWhere, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
    listresByWhereSide(param, callback) {
    this.httpService.postFormData(this.api.listresByWhereSide, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  uploadFilePost(param, callback) {
    this.httpService.postFormFile(this.api.infunde, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getListCodeData(param, callback) {
    this.httpService.postFormData(this.api.listCodeData, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getmodelDwnload(callback) {
    this.httpService.get(this.api.modelDwnload, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
}
