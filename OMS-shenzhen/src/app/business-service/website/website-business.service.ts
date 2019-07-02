import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';


@Injectable()
export class WebsiteBusinessService {
  constructor(private httpService: HttpService) { }

  api: any = {
    bannerList: "/busi/official/banner/list",
    articleList: "/busi/official/article/list",
    messageList: "/busi/official/message/list",
    bannerAdd: "/busi/official/banner/save",
    bannerDetail: "/busi/official/banner/bannerdetail",
    articleAdd:"/busi/official/article/save",
    bannerDel:"/busi/official/banner/delBanner",
    articleDel:"/busi/official/article/delArticle",
    messageDel:"/busi/official/message/delMessage",
    bannerUpdata:"/busi/official/banner/status",
    articleUpdata:"/busi/official/article/status",
    messageUpdata:"/busi/official/message/status",
  }

  bannerListPost(param, callback) {
    this.httpService.postFormData(this.api.bannerList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  articleListPost(param, callback) {
    this.httpService.postFormData(this.api.articleList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  messageListPost(param, callback) {
    this.httpService.postFormData(this.api.messageList, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }


  addBannerPost(param, callback) {
    this.httpService.postFormData(this.api.bannerAdd, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  detailBannerPost(param, callback) {
    this.httpService.postFormData(this.api.bannerDetail, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    },false);
  }


  addArticleePost(param, callback) {
    this.httpService.postFormData(this.api.articleAdd, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  delBannerPost(param, callback) {
    this.httpService.postFormData(this.api.bannerDel , param, function (successful, data, res) {
      if (successful) {
        callback();
      }
    }, function (successful, msg, err) {
    });
  }

  delArticleePost(param, callback) {
    this.httpService.postFormData(this.api.articleDel, param, function (successful, data, res) {
      if (successful) {
        callback();
      }
    }, function (successful, msg, err) {
    });
  }

  delMessagePost(param, callback) {
    this.httpService.postFormData(this.api.messageDel, param, function (successful, data, res) {
      if (successful) {
        callback();
      }
    }, function (successful, msg, err) {
    });
  }

  updataBannerPost(param, callback) {
    this.httpService.postFormData(this.api.bannerUpdata, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }
  updataArticlePost(param, callback) {
    this.httpService.postFormData(this.api.articleUpdata, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

  updataMessagePost(param, callback) {
    this.httpService.postFormData(this.api.messageUpdata, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    });
  }

}
