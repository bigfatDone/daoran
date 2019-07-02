import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../shared/toast/toast.service';

import { ModalService } from '../shared/modal/modal.service';
import { ConfirmConfig } from '../shared/modal/modal-model';

import { AvatarCropperComponent } from '../business-shared/user/avatar-cropper.component';
import { UserPasswordComponent } from '../business-shared/user/user-password.component';
import { AppService } from '../app.service';

import { MainBusinessService } from '../business-service/main/main-business.service';
import { MenuBusinessService } from '../business-service/menu/menu-business.service';
import { UserBusinessService } from '../business-service/user/user-business.service';

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

  // 用户数据
  userData: any = {
    userName: "",
    mobilePhone: "",
    email: "",
    positions: "",
    userAvatar: "./assets/img/user-header.png"
  };

  options: any = {
    axis: 'y',
    theme: 'minimal-dark',
    autoDraggerLength: true
  };

  // 菜单数据
  menuData: any;

  title: string = "首页";

  constructor(private router: Router, private menuBusinessService: MenuBusinessService, private mainBusinessService: MainBusinessService, private userBusinessService: UserBusinessService, private modalService: ModalService, private ngbModalService: NgbModal, private toastService: ToastService, private appService: AppService) {
    this.appService.titleEventEmitter.subscribe((value: string) => {
      if (value) {
        this.title = value;
      }
    });
  }

  ngOnInit() {

    let that = this;
    that.menuData = this.mainBusinessService.menuData();
    this.appService.updateMenus.subscribe((value: any) => {
      that.menuData = value;
    });
    if (localStorage.userInfo !== "undefined") {
      this.userInfo = JSON.parse(localStorage.userInfo);
      this.userData = {
        userName: this.userInfo.userName,
        mobilePhone: this.userInfo.mobilePhone,
        email: this.userInfo.email,
        positions: this.userInfo.positionid,
        userAvatar: "./assets/img/user-header.png"
      };
    }
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
      let exitSysCfg = new ConfirmConfig('请重新登录？');
      this.modalService.confirm(exitSysCfg).then((result) => {
        if (result.status === "approved") {
          this.router.navigate(['/login']);
        }
      }, (reason) => {
      });
    }
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
  fadeIn(){
    if(!this.showFlag){
      this.showFlag = true;
    }else {
      this.showFlag = false;
    }
  }
  hide(){
    this.showFlag = false;
  }
  toYY() {
    window.open("http://oms.daoran.tv/")
  }
  toKH() {
    window.open("http://crm.daoran.tv")
  }
  toBQ() {
    window.open("http://tag.daoran.tv")
  }
  toJS() {
    window.open("http://bls.daoran.tv")
  }
  toJF() {
    window.open("http://bi.daoran.tv")
  }
  toNR() {
    window.open("http://cms.daoran.tv")
  }
}


