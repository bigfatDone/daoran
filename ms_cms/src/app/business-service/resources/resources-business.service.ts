import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
@Injectable()
export class ResourcesBusinessService {
  constructor(private httpService: HttpService, private toastService: ToastService) { }
  api: any = {
    audioList: "/audio/listAudio.do",
    audioInfo: "/audio/details.do",
    audioSave: "/audio/updateAudioInfo.do",
    audioSaveArt: "/audio/updateRelevance.do",
    audioExcel: "/audio/exportAudioExcel.do",
    videoExcel: "/video/exportVideoExcel.do",
    videoPlay: "/video/getVideoPlayUrl.do",
    audioPlay: "/audio/getAudioPlayUrl.do",
    drawPlay: "/paint/getPaintPlayUrl.do",
    drawExcel: "/paint/exportPaintExcel.do",
    videoList: "/video/ListVideo.do",
    videoManger:"/video/details.do" ,
    updateVideoManger:"//video/updateVideoInfo.do" ,
    uploadPic:"/video/uploadVideoImg.do" ,
    getVidPicDetail:"/video/getImageList.do" ,
    getDrawPicDetail:"/paint/getPaintImageList.do" ,
    uploadPaintPic:"/paint/uploadPaintImg.do" ,
    setvideoPic:"/video/updateImageDisplay.do" ,
    setpaintPic:"/paint/updateImageDisplay.do" ,
    delVideoPic:"/video/deleteImage.do",
    addRelevanceArtist:"/artist/addRelevanceArtist.do",
    delRelevanceArtist:"/artist/delRelevanceArtist.do",
    chooseArtist:"/artist/chooseArtist.do",
    relateArt:"/artist/detArtist.do",
    videoInfo: "/video/info",
    videoSaveArt: "/video/upRelevance.do",
    drawList: "/paint/getListPaint.do",
    drawInfo: "/paint/detPaint.do",
    drawSave: "/paint/updatePaintInfo.do",
    delDrawPic: "/paint/delPaintImage.do",
    getCp   : "/cp/getListCp.do",
    getRelevanceList   : "/artist/getRelevanceList.do ",

  }
  uploadFlag = true;
  getCpPost(callback) {
    let that = this;
    this.httpService.postFormData(this.api.getCp, {}, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }

  videoList(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.videoList , param, function (successful, data, res) {
      if (successful) {
        that.uploadFlag = false;
        callback(data.data);
      }
    }, function (successful, msg, err) {
    },that.uploadFlag);
  }

  audioList(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.audioList, param, function (successful, data, res) {
      if (successful) {
        that.uploadFlag = false;
        callback(data);
      }
    }, function (successful, msg, err) {
    },that.uploadFlag);
  }
  drawList(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.drawList , param, function (successful, data, res) {
      if (successful) {
        callback(data.data);
        that.uploadFlag = false;
      }
    }, function (successful, msg, err) {
      },that.uploadFlag);
  }
  audioInfo(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.audioInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }

  getRelevanceList(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.getRelevanceList, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  audioSave(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.audioSave, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  audioExcel(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.audioExcel, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  videoExcel(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.videoExcel, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }else {
      }
    }, function (successful, msg, err) {
    });
  }
  videoPlay(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.videoPlay, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  audioPlay(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.audioPlay, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  drawPlay(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.drawPlay, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  drawExcel(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.drawExcel, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      } else {
      }
    }, function (successful, msg, err) {

      // const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
      // that.toastService.toast(toastCfg);
    },false);
  }


  chooseArtist(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.chooseArtist , param, function (successful, data, res) {
      if (successful) {
        that.uploadFlag = false;
        callback(data.data);
      }
    }, function (successful, msg, err) {
    },false);
  }

  videoEditArt(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.videoSaveArt, param, function (successful, data, res) {
      if (successful) {
        callback(data.data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  audioEditArt(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.audioSaveArt, param, function (successful, data, res) {
      if (successful) {
        callback(data.data);
      }
    }, function (successful, msg, err) {
    });
  }
  videoInfo(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.videoManger, param, function (successful, data, res) {
      if (successful) {
        callback(data);
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
  getVidPicDetail(param, callback) {
    this.httpService.postFormData(this.api.getVidPicDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  getDrawPicDetail(param, callback) {
    this.httpService.postFormData(this.api.getDrawPicDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  uploadPaintPic(param, callback) {
    this.httpService.postFormFile(this.api.uploadPaintPic, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    }, false);
  }
  delVideoPic(param, callback) {
    this.httpService.postFormData(this.api.delVideoPic, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  setDefaultVidPic(param, callback) {
    this.httpService.postFormData(this.api.setvideoPic, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  setDefaultPaiPic(param, callback) {
    this.httpService.postFormData(this.api.setpaintPic, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
  delRelevanceArtist(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.delRelevanceArtist , param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  delAudioPic(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.delAudioPic , param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  delDrawPic(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.delDrawPic , param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }

  addRelevanceArtist(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.addRelevanceArtist , param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    },false);
  }
  relateArt(param, callback) {
    this.httpService.postFormData(this.api.relateArt, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }


  videoSave(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.updateVideoManger, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }

  drawInfo(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.drawInfo, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }

  drawSave(param, callback) {
    let that = this;
    this.httpService.postFormData(this.api.drawSave, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }



}
