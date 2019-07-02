import { Component, OnInit, ViewChild, OnDestroy, HostListener} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { AppService } from '../../app.service';
import { HttpService } from '../../shared/http/http.service';
import { UserBusinessService} from '../../business-service/user/user-business.service';
import { UserSaveComponent} from './user-save.component';
import { UserPasswordComponent} from './user-password.component';

@Component({
  selector: '[onScroll, c-user-list]',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  dataList: Array<any>= [];
  selectCheck: Array<any>= [];
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0,// 页码数量
  };

  onPageChanged($event) {
    this.options.page = $event;
    this.getUserList({page: this.options.page, rows: this.options.rows, userName: this.userName, realName: this.realName});
  }

  userName: String;
  realName: String;
  search() {
    this.options.page = 1;
    this.defaultList();
  }

  constructor(private appService: AppService,
              private ngbModalService: NgbModal,
              private toastService: ToastService,
              private modalService: ModalService,
              private httpService: HttpService,
              private userBusinessService: UserBusinessService,
              ) {
    this.appService.titleEventEmitter.emit("用户列表");
  }

  ngOnInit() {
    this.defaultList();
    // this.headFixed();
  }

  userSaveModal: any = null;
  userPasswordModal: any = null;

  ngOnDestroy() {
    if (this.userSaveModal != null) {
      this.userSaveModal.close();
    }
    if (this.userPasswordModal != null) {
      this.userPasswordModal.close();
    }
  }

  ngAfterViewInit() {
    this.headFixed();
  }

  getUserList(repData) {
    let that = this;
    this.userBusinessService.getUserList(repData, function(data){
      if (data.obj) {
        that.dataList = data.obj.results;
        that.options.page = data.obj.page;
        that.options.total = data.obj.total;
        that.options.pageCount = Math.ceil(data.obj.total / data.obj.rows) * data.obj.rows;
      }
    });
  }

  defaultList () {
    this.getUserList({
      page: this.options.page,
      rows: this.options.rows,
      userName: this.userName,
      realName: this.realName
    });
  }

  clear () {
    let t = this;
    t.options.page = 1;
    t.userName = '';
    t.realName = '';
    t.getUserList({
      page: t.options.page,
      rows: t.options.rows,
      userName: t.userName,
      realName: t.realName
    });
  }

  checkAll(ev) {
    this.dataList.forEach(x => x.checkState = ev.target.checked);
  }

  isAllChecked() {
    if ( this.dataList.length > 0) {
      return this.dataList.every(_ => _.checkState);
    }
  }

  checkTr(index) {
    this.dataList.forEach( (el, ind) => {
      if (ind === index) {
        if (this.dataList[index].checkState) {
          this.dataList[index].checkState = false;
        } else {
          this.dataList[index].checkState = true;
        }
      }
      // else {
      //   this.dataList[ind].checkState = false;
      // }
    });
  }

  checkSingle(ev, index) {
    this.dataList[index].checkState = ev.target.checked;
  }

  saveNewUser(id) {
    this.userSaveModal = this.ngbModalService.open(UserSaveComponent);
    if (id) {
      this.userSaveModal.componentInstance.modalData = id;
    }
    this.userSaveModal.result.then((result) => {
    }, (reason) => {
      this.defaultList();
    });
  }

  editUserlock(status) {
    let that = this;
    this.updataSelectCheck(function(){
      that.userBusinessService.lockUser({ids: that.selectCheck.toString(), lockvalue: status}, function(data){
        that.defaultList();
      });
    });
  }

  resetUserPwd() {
    let that = this;
    this.updataSelectCheck(function(){
      that.userPasswordModal = that.ngbModalService.open(UserPasswordComponent);
      that.userPasswordModal.componentInstance.modalData = that.selectCheck.toString();
      that.userPasswordModal.componentInstance.isReset = true;
      that.userPasswordModal.result.then((result) => {
      }, (reason) => {

      });
    });
  }

  updataSelectCheck(callback) {
    this.selectCheck = [];
    this.dataList.forEach(i => { if (i.checkState) { this.selectCheck.push(i.id) } });
    if (this.selectCheck.length === 0) {
      this.toastService.toast(new ToastConfig(ToastType.WARNING, '', '请选择要操作的记录!', 2000));
    } else {
      callback();
    }
  }

  headFixed() {
    // window.onload = function(){
    //   var top = document.getElementById('top');
    //   console.log(666);
    //   window.addEventListener('scroll',() => {
    //     var scrollTop = window.scrollY;
    //     console.log(22, scrollTop);

		// 		// 判断滚动过的高度
		// 		if(scrollTop >= 5){
		// 			// 获取/设置元素的类
		// 			top.className += ' fixed';
		// 		}else{
		// 			top.className = 'top';
		// 		}
    //   });

		// // 	// window.onscroll = function(){
    // //   //   var scrollTop = window.scrollY;
    // //   //   console.log(22, scrollTop);
		// // 	// 	//document.body.scrollTop,document.documentElement.scrollTop

		// // 	// 	// 判断滚动过的高度
		// // 	// 	if(scrollTop >= 5){
		// // 	// 		// 获取/设置元素的类
		// // 	// 		search.className += ' fixed';
		// // 	// 	}else{
		// // 	// 		search.className = 'search';
		// // 	// 	}
		// // 	// }
    // // }
    // console.log(123);
  }
}
