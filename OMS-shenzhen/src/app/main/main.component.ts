import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../shared/toast/toast-model';

import { MainData } from '../main/main-model';
import { ModalService } from '../shared/modal/modal.service';
import { ConfirmConfig } from '../shared/modal/modal-model';

import { AvatarCropperComponent } from '../business-shared/user/avatar-cropper.component';
import { UserPasswordComponent } from '../business-shared/user/user-password.component';
import { AppService } from '../app.service';

import { MainBusinessService } from '../business-service/main/main-business.service';
import { MenuBusinessService } from '../business-service/menu/menu-business.service';
import { UserBusinessService } from '../business-service/user/user-business.service';
import { MessageBusinessService } from '../business-service/message/message-business.service';

/**
 * 主体组件
 */
@Component({
  selector: 'c-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  // 切换导航
  toggleDescTip: string = "点击关闭导航菜单";

  // 切换导航标识
  navClose: boolean = false;

  // 用户基础信息
  userInfo: any;

  options: any = {
    axis: 'xy',
    theme: 'minimal-dark',
    autoDraggerLength: true
  };

  // 用户数据
  userData: any = {
    userName: "",
    mobilePhone: "",
    email: "",
    positions: "",
    userAvatar: "./assets/img/user-header.png"
  };

  // 菜单数据
  menuData: any;

  title: string = "首页";

  constructor(private router: Router,
              private menuBusinessService: MenuBusinessService,
              private mainBusinessService: MainBusinessService,
              private userBusinessService: UserBusinessService,
              private messageBusinessService: MessageBusinessService,
              private modalService: ModalService,
              private ngbModalService: NgbModal,
              private toastService: ToastService,
              private appService: AppService) {
    this.appService.titleEventEmitter.subscribe((value: string) => {
      if (value) {
        this.title = value;
      }
    });
  }
  dataList:Array<any>= [];
  ngOnInit() {

    let that = this;

    // this.userBusinessService.userInfo(function(data) {
    //   if (data.obj === null){
    //     localStorage.userInfo = "";
    //   } else {
    //     localStorage.userInfo = JSON.stringify(data.obj);
    //   }
    //   if (data.obj !== null && data.obj !== '') {
    //     that.userInfo = JSON.parse(localStorage.userInfo);
    //     that.userData = {
    //       userName: data.obj.userName,
    //       mobilePhone: data.obj.mobilePhone,
    //       email: data.obj.email,
    //       positions: data.obj.positionid,
    //       userAvatar: "./assets/img/user-header.png"
    //     };
    //   }
    //   if (localStorage.userInfo) {
    //     that.userInfo = JSON.parse(localStorage.userInfo);
    //     that.userData = {
    //       userName: that.userInfo.userName,
    //       mobilePhone: that.userInfo.mobilePhone,
    //       email: that.userInfo.email,
    //       positions: that.userInfo.positionid,
    //       userAvatar: "./assets/img/user-header.png"
    //     };
    //   }
    // });
    this.userBusinessService.userInfo(function(data) {
      if (data.obj === null){
        localStorage.userInfo = "";
      } else if(data.obj !== null && data.obj !== '') {
        // console.log(data.obj);
        localStorage.userInfo = JSON.stringify(data.obj);
        that.userInfo = JSON.parse(localStorage.userInfo);
        that.userData = {
          userName: that.userInfo.userName,
          mobilePhone: that.userInfo.mobilePhone,
          email: that.userInfo.email,
          positions: that.userInfo.positionid,
          userAvatar: "./assets/img/user-header.png",
        };
        console.log(localStorage.userInfo.imageUrl)
      }
      // if (data.obj !== null && data.obj !== '') {
      //   that.userInfo = JSON.parse(localStorage.userInfo);
      //   that.userData = {
      //     userName: that.userInfo.userName,
      //     mobilePhone: that.userInfo.mobilePhone,
      //     email: that.userInfo.email,
      //     positions: that.userInfo.positionid,
      //     userAvatar: "./assets/img/user-header.png"
      //   };
      //   // that.userData = {
      //   //   userName: data.obj.userName,
      //   //   mobilePhone: data.obj.mobilePhone,
      //   //   email: data.obj.email,
      //   //   positions: data.obj.positionid,
      //   //   userAvatar: "./assets/img/user-header.png"
      //   // };
      // }
      // if (localStorage.userInfo) {
      //   that.userInfo = JSON.parse(localStorage.userInfo);
      //   that.userData = {
      //     userName: that.userInfo.userName,
      //     mobilePhone: that.userInfo.mobilePhone,
      //     email: that.userInfo.email,
      //     positions: that.userInfo.positionid,
      //     userAvatar: "./assets/img/user-header.png"
      //   };
      // }
      that.getMessageList();
      that.unreadMessageNum();

    });

    this.menuBusinessService.getMenuList( function(data) {
      that.menuData = data.obj;
    });
    this.appService.updateMenus.subscribe((value: any) => {
      that.menuData = value;
    });


  }

  /**
    * 切换导航
   */
  toggleNav() {
    this.navClose = !this.navClose;
    if (this.navClose) {
      this.toggleDescTip = "点击展开导航菜单";
    } else {
      this.toggleDescTip = "点击关闭导航菜单";
    }
  }

  /**
   * 跳转首页
   */
  toHome() {
    this.title = "首页";
    this.router.navigate(['/app/home']);
  }

  /**
   * 头像更换
   */
  avatarReplacement() {
    this.ngbModalService.open(AvatarCropperComponent, { size: 'lg', backdrop: 'static', keyboard: false }).result.then((result) => {

    }, (reason) => {

    });
  }

  /**
   * 修改信息
   */
  saveUser() {
    if (this.userInfo && this.userInfo.id) {
      let modalRef = this.ngbModalService.open(UserPasswordComponent);
      modalRef.componentInstance.modalData = this.userInfo.id;
      modalRef.result.then((result) => {}, (reason) => {
      });
    } else {
      let exitSysCfg = new ConfirmConfig('该用户无权限');
      this.modalService.confirm(exitSysCfg).then((result) => {
        // if (result.status === "approved") {
        //   this.router.navigate(['/login']);
        // }
      }, (reason) => {
      });
    }
  }

  /**
   * 信息推送
   */
  getMessageList() {
    let that = this;
    let param = {
      userName: this.userData.userName,
      moduleName: 'jit',
    }
    this.messageBusinessService.messageList(param, function(data){
      if (data.obj.length > 0) {
        data.obj.forEach( i => {
          let arr = i.content.replace(/\n/g, "<br/>");
          i.content = arr;
          that.dataList.push(i);
        })
      } else {
        that.dataList = [];
      }
      // setTimeout((e) => {
      //   that.getMessageList();
      // },1000000000000);
    });
  }

  messageCount: any= 0;
  unreadMessageNum() {
    let that = this;
    let param = {
      userName: this.userData.userName,
      moduleName: 'jit',
    }
    this.messageBusinessService.unreadMessageNum(param, function(data){
      if (data.obj !== null){
        if ( parseInt(data.obj.count) > 99 ){
          that.messageCount = "99+";
        } else {
          that.messageCount = data.obj.count;
        }
      }
    });
  }
  updateMessage() {
    let that = this;
    let param = {
      userName: this.userData.userName,
      moduleName: 'jit',
    }
    this.messageBusinessService.updateMessage(param, function(data){
      // if (data.obj.length > 0) {
      //   that.dataList = data.obj;
      // } else {
      //   that.dataList = [];
      // }
      // setTimeout((e) => {
      //   console.log(22222222)
      //   that.getMessageList();
      // },1000);
    });
  }


  /**
   * 退出系统
   */
  exitSys() {
    let that = this;
    let exitSysCfg = new ConfirmConfig('您确定退出系统吗？');
    this.modalService.confirm(exitSysCfg).then((result) => {
      if (result.status === "approved") {
        this.userBusinessService.userLogout(function(data){
          that.router.navigate(['/login']);
        });
      }
    }, (reason) => {
    });
  }
  showFlag = false;
  titleFlag = false;
  showTitle() {
    if (!this.titleFlag) {
      this.titleFlag = true;
      this.showFlag = false;
      this.updateMessage();
      this.messageCount = 0;
    }else {
      this.titleFlag = false;
    }
  }
  fadeIn() {
    if (!this.showFlag) {
      this.showFlag = true;
      this.titleFlag = false;
    }else {
      this.showFlag = false;
    }
  }
  hide() {
    if (this.showFlag) {
      this.showFlag = false;
    }
    if (this.titleFlag) {
      this.titleFlag = false;
    }
  }
  toYY() {
    window.open("http://192.168.1.96:9061/jit_pms");
    // window.open("http://oms.daoran.tv/");
  }
  toKH() {
    window.open("http://192.168.1.96:9041/ms_crm");
    // window.open("http://crm.daoran.tv");
  }
  toBQ() {
    window.open("http://192.168.1.96:8079/bes/cc-client/index.html");
    // window.open("http://tag.daoran.tv");
  }
  toJS() {
    window.open("http://192.168.1.96:9033/ms_bls");
    // window.open("http://bls.daoran.tv");
  }
  toJF() {
    window.open("http://192.168.1.96:9031/ms_bas");
    // window.open("http://bi.daoran.tv");
  }
  toNR() {
    window.open("http://192.168.1.96:9081/cms");
    // window.open("http://cms.daoran.tv");
  }
}


