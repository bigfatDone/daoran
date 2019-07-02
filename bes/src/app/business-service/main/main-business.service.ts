import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';

@Injectable()
export class MainBusinessService {

  constructor(private httpService: HttpService) { }

  api: any = {
    getuserInfo: "/system/getUserName",
  }
  getuserInfo(callback) {
  let that = this;
  this.httpService.postFormData(this.api.getuserInfo, {}, function (successful, data, res) {
    if (successful) {
      callback(data);
    }
  }, function (successful, msg, err) {
  },false);
}
  menuData() {
    let menuData = [
      // {
      //   "id": "1",
      //   "parentId": "0",
      //   "name": "资源管理",
      //   "keyWord": "zygl",
      //   "iconSkin": "fa fa-retweet",
      //   "children": [{
      //     "id": "11",
      //     "parentId": "1",
      //     "name": "音频",
      //     "keyWord": "yp",
      //     "iconSkin": "fa fa-music",
      //     "functionUrl": "/app/resources/audioList"
      //   },{
      //     "id": "12",
      //     "parentId": "1",
      //     "name": "视频",
      //     "keyWord": "sp",
      //     "iconSkin": "fa fa-film",
      //     "functionUrl": "/app/resources/videoList"
      //   },{
      //     "id": "13",
      //     "parentId": "1",
      //     "name": "手绘本",
      //     "keyWord": "fa-book",
      //     "iconSkin": "fa fa-plus-circle",
      //     "functionUrl": "/app/resources/drawList"
      //   }]
      // },
      {
        "id": "1",
        "parentId": "0",
        "name": "消息管理",
        "keyWord": "xxgl",
        "iconSkin": "fa fa-comments-o",
        "children": [{
          "id": "11",
          "parentId": "2",
          "name": "消息管理",
          "keyWord": "xxgl",
          "iconSkin": 'fa fa-language',
          "functionUrl": '/app/message/messageList'
        }]
      },
      {
        "id": "2",
        "parentId": "0",
        "name": "用户操作记录",
        "keyWord": "yycz",
        "iconSkin": "fa fa-ge",
        "children": [{
          "id": "11",
          "parentId": "2",
          "name": "用户操作记录",
          "keyWord": "yycz",
          "iconSkin": 'fa fa-gears',
          "functionUrl": '/app/message/recordList'
        }]
      },
      // {
      //   "id": "3",
      //   "parentId": "0",
      //   "name": "用户管理",
      //   "keyWord": "yhgl",
      //   "iconSkin": "fa fa-user-md",
      //   "children": [{
      //     "id": "31",
      //     "parentId": "3",
      //     "name": "用户列表",
      //     "keyWord": "yhlb",
      //     "iconSkin": 'fa fa-user',
      //     "functionUrl": '/app/user/userList'
      //   }]
      // }
    ];
    return menuData;
  }


}
