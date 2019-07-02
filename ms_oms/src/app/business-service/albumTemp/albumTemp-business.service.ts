import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';


@Injectable()
export class AlbumTempBusinessService {
  constructor(private httpService: HttpService) { }

  api: any = {
    albumTempDet: '/busi/special/getSpecialDetial',
    saveAlbumTemp: '/busi/special/saveSpecial',
    saveSpecial: '/busi/special/saveSpecialElement',
    saveTemplate: '/busi/special/saveSpecialModuleElement',
    delSpecial: '/busi/special/delSpecialElement',
    getSpecialModuleEleDetial: '/busi/special/getSpecialModuleEleDetial'
  };
  getSpecialModuleEleDetial(param, callback) {
    this.httpService.postFormData(this.api.getSpecialModuleEleDetial, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  albumTempDet(param, callback) {
    this.httpService.postFormData(this.api.albumTempDet, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  saveAlbumTemp(param, callback) {
    this.httpService.postFormData(this.api.saveAlbumTemp, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  delSpecial(param, callback) {
    this.httpService.postFormData(this.api.delSpecial, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  saveSpecialElement(param, callback) {
    this.httpService.postFormFile(this.api.saveSpecial, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  saveTemplateElement(param, callback) {
    this.httpService.postFormFile(this.api.saveTemplate, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
}
