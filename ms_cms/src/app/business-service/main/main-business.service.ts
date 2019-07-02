import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';

@Injectable()
export class MainBusinessService {

  constructor(private httpService: HttpService) { }

  api: any = {
  }

  menuData() {
    let menuData = [
      {
        "id": "1",
        "parentId": "0",
        "name": "资源管理",
        "keyWord": "zygl",
        "iconSkin": "fa fa-retweet",
        "children": [{
          "id": "11",
          "parentId": "1",
          "name": "音频",
          "keyWord": "yp",
          "iconSkin": "fa fa-music",
          "functionUrl": "/app/resources/audioList"
        },{
          "id": "12",
          "parentId": "1",
          "name": "视频",
          "keyWord": "sp",
          "iconSkin": "fa fa-film",
          "functionUrl": "/app/resources/videoList"
        },{
          "id": "13",
          "parentId": "1",
          "name": "手绘本",
          "keyWord": "fa-book",
          "iconSkin": "fa fa-plus-circle",
          "functionUrl": "/app/resources/drawList"
        }]
      }, {
        "id": "2",
        "parentId": "0",
        "name": "艺人管理",
        "keyWord": "yrgl",
        "iconSkin": "fa fa-user-md",
        "children": [{
          "id": "21",
          "parentId": "2",
          "name": "艺人管理",
          "keyWord": "yrgl",
          "iconSkin": 'fa fa-user',
          "functionUrl": '/app/artists/artistsList'
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
