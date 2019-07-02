import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
@Injectable()
export class ArtistsBusinessService {
  constructor(private httpService: HttpService, private toastService: ToastService) { }
  api: any = {
    artistList: "/artist/listArtist.do",
    artistsInfo: "/artist/detArtist.do",
    artistsSave: "/artist/updateArtistInfo.do",
    getArtPicDetail: "/artist/getListImgById.do",
    uploadPic: "/artist/uploadArtistImg.do",
    artistsExcel: "/artist/exportArtistExcel.do",
    setDefaultPic: "/artist/updateImageDisplay.do",
    delDrawPic: "/artist/delArtistImage.do",
  }
  uploadFlag = true;
  ArtistList(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.artistList , param, function (successful, data, res) {
      if (successful) {
        that.uploadFlag = false;
        callback(data.data);
      }
    }, function (successful, msg, err) {
    },that.uploadFlag);
  }

  artistsInfo(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.artistsInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  artistsSave(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.artistsSave, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  uploadPicPost(param, callback) {
    this.httpService.postFormFile(this.api.uploadPic, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getArtPicDetail(param, callback) {
    this.httpService.postFormData(this.api.getArtPicDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  artistsExcel(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.artistsExcel, param, function (successful, data, res) {

      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  delArtistPic(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.delDrawPic , param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  setDefaultPic(param, callback) {
    this.httpService.postFormData(this.api.setDefaultPic, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
}
