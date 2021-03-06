import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';

// import { ProgramAddComponent} from './program-add.component';
// import { ProgramIntoComponent } from './program-into.component';

import { AlbumBusinessService } from '../../business-service/album/album-business.service';

import { programType, pageResType, freeFlag} from '../../global-constant';
import {ActivatedRoute, Router} from '@angular/router';
import {AlbumAddComponent} from './album-add.component';
import {AlbumIntoComponent} from './album-into.component';
import {ArtistIntoComponent} from './artist-into.component';

@Component({
  selector: 'c-album-list',
  templateUrl: './album-list.component.html',
})
export class AlbumListComponent implements OnInit, OnDestroy {
  albumAttr: any = [{type: 1, name: "音乐MV"}, {type: 2, name: "儿童歌曲"}, {type: 3, name: "儿童教育"}, {type: 4, name: "戏曲"}, {type: 5, name: "手绘本"}];
  freeFlagData: any = [{type: 0, name: "收费"}, {type: 1, name: "免费"}];

  dataList:Array<any>= [];
  windowUrl: any;
  drawFlag = true;
  n = null;
  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  onPageChanged ($event) {
    this.options.page = $event;
    this.getList();
  }

  constructor(
    private appService: AppService,
    private ngbModalService: NgbModal,
    private albumBusinessService: AlbumBusinessService,
    private modalService: ModalService,
    private actRoute: ActivatedRoute,
    private router: Router) {
    this.appService.titleEventEmitter.emit("专辑管理");
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("draw/programList")>= 0) {
      this.drawFlag = false;
      this.appService.titleEventEmitter.emit("手绘本-节目单管理");
    }
  }

  sCode: any = "";
  sName: any = "";
  listTypes: Array<any> = [];
  listType: any = "";
  resTypes: any = pageResType.slice(1, pageResType.length);
  resType: any = "";
  // freeFlags: any = freeFlag;
  freeFlag: any = '';

  ngOnInit() {
    this.actRoute.queryParams.subscribe(queryParams => {
      this.sCode = queryParams.sCode;
    });
    this.getAllSectList();
    this.getList();
  }

  ngOnDestroy() {
    if (this.saveModal !== null) {
      this.saveModal.close();
    }
    if (this.intoResModal !== null) {
      this.intoResModal.close();
    }
  }

  search() {
    this.options.page = 1;
    this.getList();
  }

  sectData: Array<any> = [];
  sectCode: any = '';
  getAllSectList() {
    let that = this;
    let param = {};
    this.albumBusinessService.getAllSectList(param, function(data){
      console.log(data)
      if (data.sectList.length > 0) {
        that.listTypes = data.sectList;
      } else {
        that.listTypes = [];
      }
    });
  }

  getList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      albumCode: this.sCode,
      albumName: this.sName,
      sect: this.listType,
      freeFlag: this.freeFlag,
    }
    this.albumBusinessService.getAlbumListPost(param, function(data){
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.page = param.page;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
  }

  clear () {
    let t = this;
    t.options.page = 1;
    t.sCode = '';
    t.sName = '';
    t.listType = '';
    t.freeFlag = '';
    t.getList();
  }

  saveModal: any = null;
  save(id) {
    let that = this;
    this.saveModal = this.ngbModalService.open(AlbumAddComponent);
    this.saveModal.componentInstance.modalData = id;
    this.saveModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  intoResModal: any = null;
  intoRes(data) {
    let that = this;
    this.intoResModal = this.ngbModalService.open(AlbumIntoComponent, {size: "lg"});
    this.intoResModal.componentInstance.modalData = data;
    this.intoResModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }
  intoArtist(listCode, resType) {
    let that = this;
    this.intoResModal = this.ngbModalService.open(ArtistIntoComponent, {size: "lg"});
    this.intoResModal.componentInstance.modalData = {
      listCode: listCode,
      resType: resType
    }
    this.intoResModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }

  delete(id) {
    let exitSysCfg = new ConfirmConfig('确认删除该条数据？');
    this.modalService.confirm(exitSysCfg).then((result) => {
      if (result.status === "approved") {
        let that = this;
        let param = {albumCode: id};
        this.albumBusinessService.delAlbumListPost(param,function(data){
          that.getList();
        });
      }
    }, (reason) => {
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
