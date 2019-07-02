import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { Router } from '@angular/router';

@Injectable()
export class AlbumBusinessService {

  windowUrl: any;
  api: any;

  constructor(private httpService: HttpService, private router: Router) {
    this.windowUrl = this.router.url;
    // if (this.windowUrl.indexOf("/program/") >= 0 ) {
      this.api = {
        albumList: "/busi/album/list",
        albumDelete: "/busi/album/del",
        albumDetail: "/busi/album/getById",
        nodeDetail: "/busi/node/nodedetail",
        // getNodes: "/busi/node/getNodes",
        // programNodeDetail: "/busi/list/listnode",
        albumSave: "/busi/album/save",
        resList: "/busi/album/resList",
        albumres: "/busi/album/albumres",
        addrestoalbum: "/busi/album/addrestoalbum",
        resDownload: "/busi/album/resDownload",
        addrestoalbumbyexcel: "/busi/album/addrestoalbumbyexcel", //批量导入

        // 艺人录入信息部分
        artistList : "/busi/album/artistList",
        albumArtist : "/busi/album/albumArtist",
        addartisttoalbum : "/busi/album/addartisttoalbum",
        artistDownload : "/busi/album/artistDownload",
        addartisttoalbumbyexcel : "/busi/album/addartisttoalbumbyexcel", //批量导入

        listresByWhere : "/busi/list/listresByWhere",
        listresByWhereSide : "/busi//list/listresByWhereSide",
        modelDwnload : "/busi/list/download",
        infunde : "/busi/list/addResToListByExcel",
        listCodeData : "/busi/list/listnode",
        sectList: "/busi/album/getAllSectList",
      };
    // } else if (this.windowUrl.indexOf("draw/programList") >= 0 ) {
    }
  // }

  uploadAlbumExcel(param, callback) {
    this.httpService.postFormFile(this.api.addrestoalbumbyexcel, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  uploadArtistExcel(param, callback) {
    this.httpService.postFormFile(this.api.addartisttoalbumbyexcel, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }

  getAlbumListPost(param, callback) {
    this.httpService.postFormData(this.api.albumList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  getAllSectList(param, callback) {
    this.httpService.postFormData(this.api.sectList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  getAlbumDetail(param, callback) {
    this.httpService.postFormData(this.api.albumDetail, param, function (successful, data, res) {
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

  delAlbumListPost(param, callback) {
    this.httpService.postFormData(this.api.albumDelete, param, function (successful, data, res) {
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

  saveAlbumPost(param, callback) {
    this.httpService.postFormData(this.api.albumSave, param, function (successful, data, res) {
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
