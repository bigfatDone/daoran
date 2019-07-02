import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';



import { ModalService } from '../../shared/modal/modal.service';
import { TodoObjData, NeedReadObjData, NoticeObjData, CommonFuncData } from '../home/home-model';

import { UserPasswordComponent } from '../../business-shared/user/user-password.component';


@Component({
  selector: 'c-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userTipClose:boolean = false;
  isTodoCollapsed:boolean = false;
  isNoticeCollapsed:boolean = false;
  isNeedReadCollapsed:boolean = false;
  isCommonFuncCollapsed:boolean = false;

  // 用户基础信息
  userInfo: any = {
    realName: ''
  };

  noticeObj: NoticeObjData = {
    total: 60,
    noticeList: [{
      id: 1,
      title: '春节放假11天！',
      createDate: '2018-02-12'
    }, {
      id: 2,
      title: '春节放假11天！',
      createDate: '2018-02-12'
    }, {
      id: 3,
      title: '春节放假11天！',
      createDate: '2018-02-12'
    }, {
      id: 4,
      title: '春节放假11天！',
      createDate: '2018-02-12'
    }, {
      id: 5,
      title: '春节放假11天！',
      createDate: '2018-02-12'
    }, ]
  }

  commonFuncLit: CommonFuncData[][] = [
    [{
      "id": "2",
      "name": "菜单管理",
      "icon": 'fa-columns',
      "url": 'modal'
    }, {
      "id": "3",
      "name": "分页",
      "icon": 'fa-pagelines',
      "url": 'pagination'
    }, {
      "id": "4",
      "name": "数据分页器",
      "icon": 'fa-table',
      "url": 'dataPager'
    }, {
      "id": "5",
      "name": "数据表格",
      "icon": 'fa-table',
      "url": 'dataTable'
    }], [{
      "id": "6",
      "name": "bootstrap样式",
      "icon": 'fa-css3',
      "url": 'bootstrapCss'
    }, {
      "id": "7",
      "name": "自定义样式",
      "icon": 'fa-css3',
      "url": 'customCss'
    }, {
      "id": "8",
      "name": "列表",
      "icon": 'fa-list',
      "url": 'list'
    }, {
      "id": "9",
      "name": "时间选择器",
      "icon": 'fa-calendar',
      "url": 'datepicker'
    }], [{
      "id": "10",
      "name": "开关按钮",
      "icon": 'fa-toggle-on',
      "url": 'switch'
    }, {
      "id": "11",
      "name": "图表",
      "icon": 'fa-pie-chart',
      "url": 'chart'
    }, {
      "id": "12",
      "name": "树与下拉树",
      "icon": 'fa-tree',
      "url": 'tree'
    }, {
      "id": "13",
      "name": "文件上传",
      "icon": 'fa-upload',
      "url": 'fileUpload'
    }], [{
      "id": "14",
      "name": "富文本编辑器",
      "icon": 'fa-file-o',
      "url": 'editor'
    }, {
      "id": "15",
      "name": "下拉框",
      "icon": 'fa-circle',
      "url": 'select'
    }, {
      "id": "23",
      "name": "用户查询",
      "icon": "fa-search",
      "url": "userList"
    }, {
      "id": "22",
      "name": "用户添加",
      "icon": "fa-plus-circle",
      "url": "userAdd"
    }], [{
      "id": "17",
      "name": "待办信息",
      "icon": "fa-bell-o",
      "url": "task"
    }, {
      "id": "18",
      "name": "通知信息",
      "icon": "fa-bullhorn",
      "url": "task"
    }, {
      "id": "19",
      "name": "备忘信息",
      "icon": "fa-tag",
      "url": "task"
    }, {
      "id": "25",
      "name": "角色添加",
      "icon": "fa-plus-circle",
      "url": "roleAdd"
    }], [{
      "id": "32",
      "name": "系统日志",
      "icon": "fa-file",
      "url": "systemLog"
    }, {
      "id": "29",
      "name": "菜单添加",
      "icon": "fa-plus-circle",
      "url": "menuAdd"
    }, {
      "id": "26",
      "name": "角色查询",
      "icon": "fa-search",
      "url": "roleList"
    }, {
      "id": "27",
      "name": "角色分配",
      "icon": "fa-cogs",
      "url": "userList"
    }]
  ]

  commonFuncConfigTip: string = "配置常用功能";

  /**
   * 初始化
   */
  ngOnInit() {
    if (localStorage.userInfo !== "undefined") {
      this.userInfo = JSON.parse(localStorage.userInfo);
    } else {
      // this.router.navigate(['/login']);
    }
  }

  constructor(private modalService: ModalService, private ngbModalService: NgbModal, private router: Router) {

  }

  /**
   * 修改密码
   */
  saveUser () {
    let modalRef = this.ngbModalService.open(UserPasswordComponent);
    modalRef.componentInstance.modalData = this.userInfo.id;
    modalRef.result.then((result) => {}, (reason) => {
    });
  }

}
