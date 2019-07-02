import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../shared/modal/modal.service';
import { AppService } from '../../app.service';
import { PageImgshowComponent } from './page-imgshow.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import { pageGenre } from '../../global-constant';
import {PageCopyComponent} from './page-copy.component';
import {Router} from '@angular/router';
import {PageUniteComponent} from './page-unite.component';
import {AlbumTempSaveComponent} from './albumTemp-save.component';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'c-albumTemp-list',
  templateUrl: './albumTemp-list.component.html',
  styleUrls: ['./albumTemp-list.component.scss']
})
export class AlbumTempListComponent implements OnInit, OnDestroy {

  dataList: Array <any>=[];
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0,// 页码数量
  };
  pageGenres: Array<any>= pageGenre;
  pageGenre: string = "";
  windowUrl: any;
  drawFlag = true;
  // imgApi: String = "http://192.168.1.202:80/";
  constructor(
    private appService: AppService,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.appService.titleEventEmitter.emit("专题模板");
    this.windowUrl = this.router.url;
    // if (this.windowUrl.indexOf("draw/pageList")>= 0) {
    //   this.drawFlag = false;
    //   this.appService.titleEventEmitter.emit("手绘本-页面");
    // }
  }
  sCode: any;
  sAlias: any;
  sBgImageUrl: any;
  sNotice: any;
  stemplate: any;
  ngOnInit() {
    this.getPageList();
    this.showkey();
  }
  ngOnDestroy() {
    if (this.pageSaveModal !== null) {
      this.pageSaveModal.close();
    }
  }
  // 监听F8键，控制页面“删除”按钮显隐
  delflag: any = false;
  showkey() {
    let that = this;
    document.onkeydown = function (e){
      let key;
      key = e.which;
      if (key === 119) {
        that.delflag = !that.delflag;
      }
    };
  }
  onPageChanged ($event) {
    this.options.page = $event;
    this.defaultList();
  }

  defaultList () {
    this.getPageList();
  }

  clear () {
    let t = this;
    t.options.page = 1;
    t.sCode = '';
    t.sAlias = '';
    this.getPageList();
  }

  getPageList() {
    let param: any = {
      pageId: this.sCode,
      alias: this.sAlias,
      page: this.options.page,
      rows: this.options.rows,
    }
    let that = this;
    this.pageBusinessService.pageAlbumList(param, function(data) {
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.page = param.page;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
      }else {
        that.dataList = [];
      }
    });
  }

  search() {
    this.options.page = 1;
    this.defaultList();
  }

  pageSaveModal: any = null;
  addPro(data) {
    let that = this;
    this.pageSaveModal = this.ngbModalService.open(AlbumTempSaveComponent, {size: 'lg'});
    if (data) {
      this.pageSaveModal.componentInstance.pageData = data;
    }
    this.pageSaveModal.result.then((result) => {
    }, (reason) => {
      that.defaultList();
    });
  }

  intoRes() {

  }

  // pageEditModal: any = null;
  save(data) {
    let that = this;
    this.pageSaveModal = this.ngbModalService.open(AlbumTempSaveComponent, {size: 'lg'});
    this.pageSaveModal.componentInstance.albumTempData = data;
    this.pageSaveModal.result.then((result) => {
    }, (reason) => {
      that.defaultList();
    });
  }
  // pageCopyModal: any = null;
  copy(data) {
    let that = this;
    this.pageSaveModal = this.ngbModalService.open(PageCopyComponent, {size: 'lg'});
    if (data) {
      this.pageSaveModal.componentInstance.copyData = data;
    }
    this.pageSaveModal.result.then((result) => {
    }, (reason) => {
      that.defaultList();
    });
  }

  del(data) {
    const that = this;
    const param = {pageId: data.pageId};
    this.pageBusinessService.pageDetail(param, function(res){
      if ((res.dynrecs === null || res.dynrecs.length <= 0) && (res.extrecs === null || res.extrecs.length <= 0) && (res.layrecs === null || res.layrecs.length <= 0) && (res.pagerecs === null || res.pagerecs.length <= 0) ) {
        that.pageBusinessService.pageDel(param, function( resq ){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '删除成功!', 2000);
          that.toastService.toast(toastCfg);
          that.defaultList();
        });
      } else {
        that.pageSaveModal = that.ngbModalService.open(PageUniteComponent);
        that.pageSaveModal.componentInstance.modalData = data;
        that.pageSaveModal.result.then((result) => {
          if (result === 'yes') {
            that.pageBusinessService.pageDel(param, function( kk ){
              const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '删除成功!', 2000);
              that.toastService.toast(toastCfg);
              that.defaultList();
            });
          }
        }, (reason) => {
        });
      }
     });
  }

  // pageOpenImg: any = null;
  seeMdImg(data) {
    let that = this;
    let url = 'http://202.99.114.28:25603/epg_lx_hd/template/index.jsp?code=' + data + '&UserID=053701507920&EntryId=1&AccessId=02lxH_1200000_yl_mbxk_99&StbVendor=HUAWEI&ReturnUrl=http://202.99.114.28:25603/epg_lx_hd/welcome.jsp?userId=053701507920&entryId=1&accessId=02lxH_1200000_yl_mbxk_99&index=&flag=first&stbType=hw&macAddr=undefined&stbName=&backurl=';
    window.open(url);
  }
  tempConfig (data) {
    this.router.navigate(['/app/albumTemp/albumTempConfig'], {
      queryParams: {
        pageId: data.pageId,
        alias: data.alias
      }
    });
  }

  checkTr(index) {
    this.dataList.forEach( (el, ind) => {
      if (ind === index) {
        if (this.dataList[index].checkState) {
          this.dataList[index].checkState = false;
        } else {
          this.dataList[index].checkState = true;
        }
      } else {
        this.dataList[ind].checkState = false;
      }
    });
  }

}
