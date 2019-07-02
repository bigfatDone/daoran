import {Component, OnDestroy, OnInit, ViewChild, TemplateRef, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../../../../shared/modal/modal.service';
import { AppService } from '../../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../../business-service/page/page-business.service';
import { ToastConfig, ToastType } from '../../../../shared/toast/toast-model';
import { ToastService } from '../../../../shared/toast/toast.service';
import { ConfirmConfig } from '../../../../shared/modal/modal-model';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {CarouselComponent} from '../template-district/carousel.component';
import {VideoComponent} from '../template-district/video.component';
import {AnnouncementComponent} from '../template-district/announcement.component';
import {FloorComponent} from '../template-district/floor.component';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-template-a',
  templateUrl: './template-a.component.html',
  styleUrls: ['./../template-list.component.scss']
})
export class TemplateAComponent implements OnInit, OnDestroy {
  @Input() productPageId: any;
  @Input() typeMoudel: any;
  showThisEleModal: any;
  part1Img = '';
  part2Img = '';
  part3Img = {
    part3Img1: '',
    part3Img2: '',
    part3Img3: '',
    part3Img4: '',
  };
  part4Img = {
    part4Img1: '',
    part4Img2: '',
    part4Img3: '',
    part4Img4: '',
    part4Img5: '',
    part4Img6: ''
  };
  part2wz = [];
  part1 = {
    name : '分区一',
    pagePartId: '',
    partStyleId: '',
    productPageId: '',
    layout: 0
  };
  part2 = {
    name : '分区二',
    pagePartId: '',
    partStyleId: '',
    productPageId: '',
    layout: 0
  };
  part3 = {
    name : '分区三',
    pagePartId: '',
    partStyleId: '',
    productPageId: '',
    layout: 0
  };
  part4 = {
    name : '分区四',
    pagePartId: '',
    partStyleId: '',
    productPageId: '',
    layout: 0
  };
  floorList = [];
  imgApi = environment.imgApi;
  constructor(
    private appService: AppService,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
  ) {
  }
  edit(style, data) {
    const that = this;
    switch (style) {
      case 'carousel':
        this.showThisEleModal = this.ngbModalService.open(CarouselComponent, {size: 'lg'});
        this.showThisEleModal.componentInstance.oData = {
          data: data,
        };
        this.showThisEleModal.result.then((result) => {
        }, (reason) => {
          that.init();
        });
        break;
      case 'video':
        this.showThisEleModal = this.ngbModalService.open(VideoComponent, {size: 'lg'});
        this.showThisEleModal.result.then((result) => {
        }, (reason) => {
          console.log(reason);
       //   that.init();
        });
        break;
      case 'announcement':
        this.showThisEleModal = this.ngbModalService.open(AnnouncementComponent, {size: 'lg'});
        this.showThisEleModal.result.then((result) => {
        }, (reason) => {
          console.log(reason);
          //   that.init();
        });
        break;
    }
  }
  editFloor(data) {
    const that = this;
    this.showThisEleModal = this.ngbModalService.open(FloorComponent, {size: 'lg'});
    this.showThisEleModal.componentInstance.oData = data;
    this.showThisEleModal.componentInstance.modalType = {
      productPageId: this.productPageId,
    };
    this.showThisEleModal.result.then((result) => {
    }, (reason) => {
      that.init();
    });
  }
  init() {
    const that = this;
    const param = {productPageId: this.productPageId, stencilId: this.typeMoudel};
    this.pageBusinessService.getPartConfig(param, function(res){
      if (res.success) {
         if (res.obj[0].pagePartName !== null) {
           that.part1.name = res.obj[0].pagePartName;
         }
        if (res.obj[1].pagePartName !== null) {
          that.part2.name = res.obj[1].pagePartName;
        }
        if (res.obj[2].pagePartName !== null) {
          that.part3.name = res.obj[2].pagePartName;
        }
        if (res.obj[3].pagePartName !== null) {
          that.part4.name = res.obj[3].pagePartName;
        }
        that.part1.pagePartId = res.obj[0].pagePartId;
        that.part1.partStyleId = res.obj[0].partStyleId;
        that.part1.layout = res.obj[0].layout;
        that.part2.pagePartId = res.obj[1].pagePartId;
        that.part2.partStyleId = res.obj[1].partStyleId;
        that.part2.layout = res.obj[1].layout;
        that.part3.pagePartId = res.obj[2].pagePartId;
        that.part3.partStyleId = res.obj[2].partStyleId;
        that.part3.layout = res.obj[2].layout;
        that.part4.pagePartId = res.obj[3].pagePartId;
        that.part4.partStyleId = res.obj[3].partStyleId;
        that.part4.layout = res.obj[3].layout;
        that.part1.productPageId = that.productPageId;
        that.part2.productPageId = that.productPageId;
        that.part3.productPageId = that.productPageId;
        that.part4.productPageId = that.productPageId;
        if (res.obj[0].pageConfigPartEleList.length > 0) {
          that.part1Img = environment.imgApi + res.obj[0].pageConfigPartEleList[0].elementInfo.imageVa;
        }
        if (res.obj[1].pageConfigPartEleList.length > 0) {
          that.part2Img = environment.imgApi + res.obj[1].pageConfigPartEleList[0].elementInfo.imageVa;
          that.part2wz = res.obj[1].pageConfigPartEleList;
        }
        if (res.obj[2].pageConfigPartEleList.length > 0) {
          that.part3Img.part3Img1 = environment.imgApi + res.obj[2].pageConfigPartEleList[0].elementInfo.imageVa;
          if (res.obj[2].pageConfigPartEleList[1] !== undefined) {
            that.part3Img.part3Img2 = environment.imgApi + res.obj[2].pageConfigPartEleList[1].elementInfo.imageVa;
          }
          if (res.obj[2].pageConfigPartEleList[2] !== undefined) {
            that.part3Img.part3Img3 = environment.imgApi + res.obj[2].pageConfigPartEleList[2].elementInfo.imageVa;
          }
          if (res.obj[2].pageConfigPartEleList[3] !== undefined) {
            that.part3Img.part3Img4 = environment.imgApi + res.obj[2].pageConfigPartEleList[3].elementInfo.imageVa;
          }
        }
        if (res.obj[3].pageConfigPartEleList.length > 0) {
          that.part4Img.part4Img1 = environment.imgApi + res.obj[3].pageConfigPartEleList[0].elementInfo.imageVa;
          if (res.obj[3].pageConfigPartEleList[1] !== undefined) {
            that.part4Img.part4Img2 = environment.imgApi + res.obj[3].pageConfigPartEleList[1].elementInfo.imageVa;
          }
          if (res.obj[3].pageConfigPartEleList[2] !== undefined) {
            that.part4Img.part4Img2 = environment.imgApi + res.obj[3].pageConfigPartEleList[2].elementInfo.imageVa;
          }
          if (res.obj[3].pageConfigPartEleList[3] !== undefined) {
            that.part4Img.part4Img2 = environment.imgApi + res.obj[3].pageConfigPartEleList[3].elementInfo.imageVa;
          }
          if (res.obj[3].pageConfigPartEleList[4] !== undefined) {
            that.part4Img.part4Img2 = environment.imgApi + res.obj[3].pageConfigPartEleList[4].elementInfo.imageVa;
          }
          if (res.obj[3].pageConfigPartEleList[5] !== undefined) {
            that.part4Img.part4Img2 = environment.imgApi + res.obj[3].pageConfigPartEleList[5].elementInfo.imageVa;
          }
          if (res.obj[3].pageConfigPartEleList[6] !== undefined) {
            that.part4Img.part4Img2 = environment.imgApi + res.obj[3].pageConfigPartEleList[6].elementInfo.imageVa;
          }
        }
        that.floorList = res.obj.splice(4);
      }
    });
  }
  delFloor(data) {
    const that = this;
    const param = {pagePartId: data.pagePartId};
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      this.pageBusinessService.delFloorPart(param, function(res){
        if (res.success) {
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '删除成功', 2000);
          that.toastService.toast(toastCfg);
          that.init();
        }
      });
    }, (reason) => {
    });
  }
  ngOnInit() {
    this.init();
  }
  ngOnDestroy() {
  }
}
