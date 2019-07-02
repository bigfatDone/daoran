import {Component, OnDestroy, OnInit, AfterViewInit, ElementRef} from '@angular/core';
import {NgbModal, NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { AppService } from '../../app.service';
import { ToastService } from '../../shared/toast/toast.service';
import {articleType, startFlag} from '../../global-constant';
import { AlbumTempSaveComponent } from './albumTemp-save.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AlbumTempBusinessService} from '../../business-service/albumTemp/albumTemp-business.service';
import { environment } from '../../../environments/environment';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';

import {ElementSaveComponent} from './element-save.component';
import {ConfirmConfig} from '../../shared/modal/modal-model';

@Component({
  selector: 'c-albumTemp-config',
  templateUrl: './albumTemp-config.component.html',
  styleUrls: ['./albumTemp-config.component.scss']
})
export class AlbumTempConfigComponent implements OnInit, OnDestroy, AfterViewInit {

  dataList: Array<any>= [];
  router_pageId: any;
  router_alias: any;

  pageOptions: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };
  options: any = {
    axis: 'xy',
    theme: 'minimal-dark',
    autoDraggerLength: true
  };

  onPageChanged ($event) {
    this.pageOptions.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private albumTempBusinessService: AlbumTempBusinessService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private el: ElementRef,
    private router: Router) {
    this.appService.titleEventEmitter.emit("专题配置模板");
    activatedRoute.queryParams.subscribe(queryParams => {
      this.router_pageId = queryParams.pageId;
      this.router_alias = queryParams.alias;
    });
  }


  imgApi: any = "";
  imgApiSD: any = "";
  random: any = "";
  ngOnInit() {
    let that = this;
    this.imgApi = environment.imgApi;
    this.imgApiSD = environment.imgApiSD;
    this.getList();

    // window.onload = function () {
    //   setTimeout( _ => {
    //     that.viewInit();
    //   }, 1000)
    //   // that.viewInit();
    // };
  }
  ngOnDestroy() {
    if (this.AlbumTempModal !== null ) {
      this.AlbumTempModal.close();
    }
  }
  ngAfterViewInit () {
    let that = this;
    // setTimeout( _ => {
    //   that.viewInit();
    // }, 1000);
    // that.viewInit();
  }
  viewInit () {
    if (this.layFlag && this.layrecList.length !== 0) {
      this.layrecList.forEach((i, index) => {
        this.el.nativeElement.querySelector('.layImg' + index ).style.width = i.eleWidth + 'px';
        this.el.nativeElement.querySelector('.layImg' + index ).style.height = i.eleHeight + 'px';
        this.el.nativeElement.querySelector('.layDiv' + index ).style.left = i.eleLeft + 'px';
        this.el.nativeElement.querySelector('.layDiv' + index ).style.top = i.eleTop + 'px';
      });
    } else {
      this.extrecList.forEach((i, index) => {
        this.el.nativeElement.querySelector('.extImg' + index ).style.width = i.eleWidth + 'px';
        this.el.nativeElement.querySelector('.extImg' + index ).style.height = i.eleHeight + 'px';
        this.el.nativeElement.querySelector('.extDiv' + index ).style.left = i.eleLeft + 'px';
        this.el.nativeElement.querySelector('.extDiv' + index ).style.top = i.eleTop + 'px';
      });
    }
  }
  search() {
    this.pageOptions.page = 1;
    this.getList();
  }

  dataDetial: any;
  layFlag: any = true;
  extFlag: any = false;
  layrecData: any;
  extrecData: any;
  layrecList: Array<any> = [];
  extrecList: Array<any> = [];
  bgUrl: any;
  getList() {
    let that = this;
    let param = {
      pageId: this.router_pageId,
    }
    this.albumTempBusinessService.albumTempDet(param, function(data){
      if (!!data && data.length !== 0) {
        that.bgUrl = data.bgImageUrl === null ? '' : data.bgImageUrl + '?random=' + Math.random();
        that.dataDetial = data;
        that.random = Math.random();
        data.partList.forEach( i => {
          if (i.partType === 'layrec') {
            that.layrecData = i;
            that.layrecList = i.partElementVoList;
          } else {
            that.extrecData = i;
            that.extrecList = i.partElementVoList;
          }
        });
      } else {
        that.layrecData = {};
        that.extrecData = {};
        // that.dataList = [];
      }
      // that.viewInit();
      setTimeout( _ => {
        that.viewInit();
      }, 500);
    });
  }

  onTabChange($event: NgbTabChangeEvent) {
    let that = this;
    if ($event.nextId === 'HD') {
      // this.dataDetial.forEach( i => {
      //   if (i.partType === 'layrec') {
      //     this.dataList = i;
      //   }
      // });
      this.layFlag = true;
      this.extFlag = false;
    } else if ($event.nextId === 'SD') {
      // this.dataList = this.extrecData;
      // this.dataDetial.forEach( i => {
      //   if (i.partType === 'extrec') {
      //     this.dataList = i;
      //   }
      // });
      this.layFlag = false;
      this.extFlag = true;
    }
    setTimeout( _ => {
      that.viewInit();
    }, 500);
  }

  clear () {
    // let t = this;
    // t.pageOptions.page = 1;
    // t.title = '';
    // t.type = '';
    // t.state = '';
    // t.getList();
  }

  AlbumTempModal: any = null;
  edit(ind, type) {
    let that = this;
    this.AlbumTempModal = this.ngbModalService.open(AlbumTempSaveComponent, {size: 'sm'});
    if (type === 'lay') {
      this.AlbumTempModal.componentInstance.AlbumTempData = {
        ind: ind,
        data: that.layrecList
      };
    } else {
      this.AlbumTempModal.componentInstance.AlbumTempData = {
        ind: ind,
        data: that.extrecList
      };
    }
    this.AlbumTempModal.result.then((result) => {
      if (type === 'lay') {
        that.layrecList = result.data;
      } else {
        that.extrecList = result.data;
      }
      setTimeout( _ => {
        that.viewInit();
      }, 500);
    }, (reason) => {
      // that.getList();
    });
  }

  save(data1, data2, data3, type) {
    let that = this;
    this.AlbumTempModal = this.ngbModalService.open(ElementSaveComponent, {size: 'sm'});
    this.AlbumTempModal.componentInstance.modalData = {
      data: data1,
      partId: data2.partId,
      type: type
    };
    if (type === 'edit') {
      this.AlbumTempModal.componentInstance.modalData.data.pageId = data3.pageId;
    }
    this.AlbumTempModal.result.then((result) => {

    }, (reason) => {
      that.getList();
    });
  }

  posMove(ind) {
    let oDiv;
    if (this.layFlag) {
      oDiv = this.el.nativeElement.querySelector('.layDiv' + ind );
    } else {
      oDiv = this.el.nativeElement.querySelector('.extDiv' + ind );
    }
    let oParent = this.el.nativeElement.querySelector('.right');
    let sent = {
      l: 0,
      r: 1280 - oDiv.offsetWidth, // 右边界，oParent为父div
      t: 0,
      b: 722 - oDiv.offsetHeight,
      n: 0
    }
    this.drag(oDiv, sent, ind);
  }
  drag(obj, s, ind) {
    let that = this;
    let dmW = document.documentElement.clientWidth || document.body.clientWidth;
    let dmH = document.documentElement.clientHeight || document.body.clientHeight;

    let sent = s || {};
    let l = sent.l || 0;
    let r = sent.r || dmW - obj.offsetWidth;
    let t = sent.t || 0;
    let b = sent.b || dmH - obj.offsetHeight;
    let n = sent.n || 10;

    obj.onmousedown = function (ev){
      let oEvent:any = ev || window.event;
      let sentX = oEvent.clientX - obj.offsetLeft;
      let sentY = oEvent.clientY - obj.offsetTop;

      document.onmousemove = function ( ev ){
        let oE: any = ev || window.event;
        let slideLeft = oE.clientX - sentX;
        let slideTop = oE.clientY - sentY;
        if(slideLeft <= l){
          slideLeft = l;
        }
        if(slideLeft >= r){
          slideLeft = r;
        }
        if(slideTop <= t){
          slideTop = t;
        }
        if(slideTop >= b){
          slideTop = b;
        }

        obj.style.left = slideLeft + 'px';
        obj.style.top = slideTop + 'px';

        if (that.layFlag) {
          that.dataDetial.partList.forEach( (i, index) => {
            if (i.partType === 'layrec') {
              i.partElementVoList.forEach( (j, ind_lay) => {
                if (ind_lay === ind) {
                  j.eleTop = slideTop;
                  j.eleLeft = slideLeft;
                }
              });
            }
          });
        } else {
          that.dataDetial.partList.forEach( (i, index) => {
            if (i.partType === 'extrec') {
              i.partElementVoList.forEach( (j, ind_ext) => {
                if (ind_ext === ind) {
                  j.eleTop = slideTop;
                  j.eleLeft = slideLeft;
                }
              });
            }
          });
        }
      };
      document.onmouseup = function (){
        document.onmousemove = null;
        document.onmouseup = null;
      }
      return false;
    };
  }
  ok():void  {
    let that = this;
    let param = {
      pageId: this.router_pageId,
    }
    that.dataDetial.partList.forEach( i => {
      if (i.partType === "layrec") {
        i.partElementVoList = that.layrecList;
      } else {
        i.partElementVoList = that.extrecList;
      }
    })
    this.albumTempBusinessService.saveAlbumTemp({pageStr: JSON.stringify(that.dataDetial)}, function(data){
      const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 3000);
      that.toastService.toast(toastCfg);
    });
  }
  close() {
    this.router.navigate(['/app/page/albumTempList'], {
      queryParams: {
        pageId: this.dataDetial.pageId,
        alias: this.dataDetial.alias
      }
    });
  }
  del(id, data){
    console.log(id)
    console.log(data)
    let that = this;
    let param = {elementId: id.elementId, partId: id.partId};
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.albumTempBusinessService.delSpecial (param, function(data){
        that.getList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000));
      });
    }, (reason) => {
      that.getList();
    });
  }

}
