import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { Router } from '@angular/router';

@Injectable()
export class ProgramBusinessService {

  windowUrl: any;
  api: any;

  constructor(private httpService: HttpService, private router: Router) {
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("/program/") >= 0 ) {
      this.api = {
        programList: "/busi/list/list",
        programDelete: "/busi/list/delLists",
        programDetail: "/busi/list/listdetail",
        nodeDetail: "/busi/node/nodedetail",
        getNodes: "/busi/node/getNodes",
        programNodeDetail: "/busi/list/listnode",
        programSave: "/busi/list/save",
        resList: "/busi/list/reslist",
        selectNodePoints: "/busi/list/reslist",
        getNodeCodes: "/busi/list/getNodeCodes",
        saveRestoList : "/busi/list/addrestolist",
        listResDetail : "/busi/list/listres",
        listresByWhere : "/busi/list/listresByWhere",
        listresByWhereSide : "/busi//list/listresByWhereSide",
        modelDwnload : "/busi/list/download",
        infunde : "/busi/list/addResToListByExcel",
        listCodeData : "/busi/list/listnode",
        copyList : "/busi/list/copyList",
        deleteLayer : "/busi/list/delListImage",
      };
    } else if (this.windowUrl.indexOf("draw/programList") >= 0 ) {
      this.api = {
        programList: "/busi/hbdlist/getListInfoList",
        programDelete: "/busi/hbdlist/delLists",
        programDetail: "/busi/hbdlist/getList",
        nodeDetail: "/busi/node/nodedetail",
        getNodes: "/busi/node/getNodes",
        programNodeDetail: "/busi/list/listnode",
        programSave: "/busi/hbdlist/save",
        resList: "/busi/hbdlist/getResList",
        selectNodePoints: "/busi/hbdlist/getResList",
        getNodeCodes: "/busi/list/getNodeCodes",
        saveRestoList : "/busi/hbdlist/addResToList",
        listResDetail : "/busi/hbdlist/getListDetailList",
        modelDwnload : "/busi/list/download",
        infunde : "/busi/hbdlist/addResToListByExcel",
        listCodeData : "/busi/hbdlist/getListNode",
        deleteLayer : "/busi/list/delListImage",
      };
    }
  }

  getProgramListPost(param, callback) {
    this.httpService.postFormData(this.api.programList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  getProgramDetail(param, callback) {
    this.httpService.postFormData(this.api.programDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getProgramNodeDetail(param, callback) {
    this.httpService.postFormData(this.api.programNodeDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  delProgramListPost(param, callback) {
    this.httpService.postFormData(this.api.programDelete, param, function (successful, data, res) {
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

  getNodes(callback) {
    this.httpService.postFormData(this.api.getNodes, {}, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  deleteLayer(param, callback) {
    this.httpService.postFormData(this.api.deleteLayer, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  saveProgramPost(param, callback) {
    this.httpService.postFormFile(this.api.programSave, param, function (successful, data, res) {
      if (successful) {
        callback( );
      }
    }, function (successful, msg, err) {
    });
  }

  getResList(param, callback) {
    this.httpService.postFormData(this.api.resList, param, function (successful, data, res) {
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
    this.httpService.postFormData(this.api.saveRestoList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  getListResDetail(param, callback) {
    this.httpService.postFormData(this.api.listResDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data);
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
  copyList(param, callback) {
    this.httpService.postFormData(this.api.copyList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }
}
