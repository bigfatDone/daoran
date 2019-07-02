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
import {environment} from '../../../../../environments/environment';
import {FloorComponent} from '../template-district/floor.component';

@Component({
  selector: 'app-template-d',
  templateUrl: './template-d.component.html',
  styleUrls: ['./../template-list.component.scss']
})
export class TemplateDComponent implements OnInit, OnDestroy {
  @Input() productPageId: any;
  @Input() typeMoudel: any;
  showThisEleModal: any;
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
  part1Img = {
    part1Img1: '',
    part1Img2: '',
  };
  part2Img = {
    part2Img1: '',
    part2Img2: '',
    part2Img3: '',
    part2Img4: '',
  };
  part3Img = {
    part3Img1: '',
    part3Img2: '',
    part3Img3: '',
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
    switch (style) {
      case 'carousel':
        const that = this;
        this.showThisEleModal = this.ngbModalService.open(CarouselComponent, {size: 'lg'});
        this.showThisEleModal.componentInstance.oData = {
          data: data,
        };
        this.showThisEleModal.result.then((result) => {
        }, (reason) => {
          that.init();
        });
        break;
    }
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
        that.part1.pagePartId = res.obj[0].pagePartId;
        that.part1.partStyleId = res.obj[0].partStyleId;
        that.part1.layout = res.obj[0].layout;
        that.part2.pagePartId = res.obj[1].pagePartId;
        that.part2.partStyleId = res.obj[1].partStyleId;
        that.part2.layout = res.obj[1].layout;
        that.part3.pagePartId = res.obj[2].pagePartId;
        that.part3.partStyleId = res.obj[2].partStyleId;
        that.part3.layout = res.obj[2].layout;
        that.part1.productPageId = that.productPageId;
        that.part2.productPageId = that.productPageId;
        that.part3.productPageId = that.productPageId;
        if (res.obj[0].pageConfigPartEleList.length > 0) {
          that.part1Img.part1Img1 = environment.imgApi + res.obj[0].pageConfigPartEleList[0].elementInfo.imageVa;
          if (res.obj[0].pageConfigPartEleList[1] !== undefined) {
            that.part1Img.part1Img2 = environment.imgApi + res.obj[0].pageConfigPartEleList[1].elementInfo.imageVa;
          }
        }
        if (res.obj[1].pageConfigPartEleList.length > 0) {
          that.part2Img.part2Img1 = environment.imgApi + res.obj[1].pageConfigPartEleList[0].elementInfo.imageVa;
          if (res.obj[1].pageConfigPartEleList[1] !== undefined) {
            that.part2Img.part2Img2 = environment.imgApi + res.obj[1].pageConfigPartEleList[1].elementInfo.imageVa;
          }
          if (res.obj[1].pageConfigPartEleList[2] !== undefined) {
            that.part2Img.part2Img3 = environment.imgApi + res.obj[1].pageConfigPartEleList[2].elementInfo.imageVa;
          }
          if (res.obj[1].pageConfigPartEleList[3] !== undefined) {
            that.part2Img.part2Img4 = environment.imgApi + res.obj[1].pageConfigPartEleList[3].elementInfo.imageVa;
          }
        }
        if (res.obj[2].pageConfigPartEleList.length > 0) {
          that.part3Img.part3Img1 = environment.imgApi + res.obj[2].pageConfigPartEleList[0].elementInfo.imageVa;
          if (res.obj[1].pageConfigPartEleList[1] !== undefined) {
            that.part3Img.part3Img2 = environment.imgApi + res.obj[2].pageConfigPartEleList[1].elementInfo.imageVa;
          }
          if (res.obj[1].pageConfigPartEleList[2] !== undefined) {
            that.part3Img.part3Img3 = environment.imgApi + res.obj[2].pageConfigPartEleList[2].elementInfo.imageVa;
          }
        }
        that.floorList = res.obj.splice(2);

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
  ngOnInit() {
    this.init();
  }
  ngOnDestroy() {
  }
}
