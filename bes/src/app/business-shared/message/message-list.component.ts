import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { ToastService } from '../../shared/toast/toast.service';
import { AppService } from '../../app.service';
import { HttpService } from '../../shared/http/http.service';
import {MessageBusinessService} from '../../business-service/message/message-business.service';
import { ActivatedRoute } from '@angular/router';
import { artArea, artType} from '../../global-constant';
import {environment} from '../../../environments/environment';
import {CustomScrollbarDirective} from '../../shared/custom-scrollbar/custom-scrollbar.directive';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {MessageSaveComponent} from './message-save.component';
import {MessageSeeComponent} from './message-see.component';

@Component({
  selector: 'c-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit, OnDestroy {
  @ViewChild(CustomScrollbarDirective)updateSc: CustomScrollbarDirective;
  artTypes: Array<any>= artType;
  artAreas: Array<any>= artArea;
  dataList: Array<any>= [];
  artCode: any;
  artArea: any = "";
  artCodeName: any = "";
  artName: any = "";
  artType: any = "";

  showImg: any = "";




  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0,// 页码数量
  };

  onPageChanged($event) {
    this.options.page = $event;
    this.getList();
  }

  userName: String;
  realName: String;
  // search() {
  //   this.options.page = 0;
  //   this.getList();
  // }

  constructor(private appService: AppService,
              private actRoute: ActivatedRoute,
              private messageBusinessService: MessageBusinessService,
              private ngbModalService: NgbModal,
              private modalService: ModalService,
              private toastService: ToastService,
  ) {
    this.appService.titleEventEmitter.emit("艺人");
  }

  ngOnInit() {
    // if(this.actRoute.snapshot.params['artCode']) {
    //   this.artCode = this.actRoute.snapshot.params['artCode'];
    // }
    this.getList();
  }
  ngOnDestroy(){
    // if(this.messageModal !== null){
    //   this.messageModal.close();
    // }
  }

  // 获取列表
  loadingFlag = true;
  getList() {
    this.loadingFlag = true;
    let that = this;
    let parmas;
    let parma= {
      currPage: this.options.page,
      pageSize: this.options.rows,
    };
    // parmas = {jsonParam:JSON.stringify(parma)};
    this.messageBusinessService.listMessage(parma, function(data){
        if (data.data.listSystemMessage.length > 0 ) {
          that.dataList = data.data.listSystemMessage;
          that.options.page = parma.currPage;
          that.options.total = data.data.count;
          that.options.pageCount = Math.ceil(data.data.count / that.options.rows) * that.options.rows;
        } else {
          that.dataList = [];
        }
    });
  }
  getIds () {
    let ids = [];
    this.dataList.forEach(i => {
      if (i.checkState) {
        ids.push(i.id);
      }
    });
    return ids.toString();
  }

  del(id) {
    let that = this;
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      let param: any = {};
      if (id !== '') {
        param.ids = id;
      } else {
        param.ids = this.getIds();
      }
      that.messageBusinessService.deleteMessage (param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000));
      });
    }, (reason) => {
      that.getList();
    });
  }
  updateMessage() {
    this.loadingFlag = true;
    let that = this;
    let parmas;
    let parma= {
      artistCode:this.artCodeName,
      artistName:this.artName,
    };
    parmas = {jsonParam:JSON.stringify(parma)};
    // this.messageBusinessService.updateMessage(parmas, function(data){
    //     if (data.length > 0 ) {
    //       data.forEach(i => that.dataList.push(i));
    //       that.updateSc.updateScrollbar();
    //       // that.isCanLoad = true;
    //       // that.options.page = data.currPage;
    //       // that.options.total = data.pageSize;
    //       // that.options.pageCount = Math.ceil(data.obj.total / data.obj.rows) * data.obj.rows;
    //     } else {
    //       that.loadingFlag = false;
    //     }
    //     // that.options.page = data.currPage;
    //     // that.options.total = data.pageSize;
    //     // that.options.pageCount = Math.ceil(data.obj.total / data.obj.rows) * data.obj.rows;
    // });
  }



  clear () {
    this.dataList = [];
    this.options.page = 0;
    this.artCodeName = '',
    this.artName = '',
    this.artType = '',
    this.artArea = '',
    this.getList();
  }

  checkAll(ev) {
    this.dataList.forEach(x => x.checkState = ev.target.checked);
  }

  isAllChecked() {
    if ( this.dataList.length > 0) {
      return this.dataList.every(_ => _.checkState);
    }
  }

  checkSingle(ev, index) {
    this.dataList[index].checkState = ev.target.checked;
  }

  messageModal: any;
  save(id) {
    let that = this;
    this.messageModal = this.ngbModalService.open(MessageSaveComponent, {size: 'lg'});
    this.messageModal.componentInstance.modalData = id
    this.messageModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }
  seeMessage(data) {
    let that = this;
    this.messageModal = this.ngbModalService.open(MessageSeeComponent, {size: 'lg'});
    if (data) {
      this.messageModal.componentInstance.messageData = data;
    }
    this.messageModal.result.then((result) => {
    }, (reason) => {
    });
  }
}
