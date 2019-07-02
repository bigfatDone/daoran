import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import { carrierAttr, odSysState } from '../../global-constant';
import {ActiveBusinessService} from '../../business-service/active/active-business.service';


@Component({
  selector: 'c-actRecord-save',
  templateUrl: './actRecord-save.component.html'
})
export class ActRecordSaveComponent implements OnInit {

  saveActRecordForm: FormGroup;

  modalData: any = '';

  carrierAttr: Array<any>= carrierAttr;
  projects: Array<any>= [];
  provinces: Array<any>= [];
  products: Array<any>= [];
  stateData: Array<any>= odSysState;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private activeBusinessService: ActiveBusinessService,
  ) {
    const nodeCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const actCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const itemCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const prizeNameFc = new FormControl('', Validators.compose([]));
    const prizeLevelFc = new FormControl('', Validators.compose([]));
    const sendFlagFc = new FormControl('', Validators.compose([]));
    const prizeTypeFc = new FormControl('', Validators.compose([]));
    const dprojectCodeFc = new FormControl('', Validators.compose([Validators.required]));
    const userIdFc = new FormControl('', Validators.compose([Validators.required]));
    const dtelFc = new FormControl('', Validators.compose([Validators.required]));
    const winStatusFc = new FormControl('', Validators.compose([Validators.required]));
    const selectedDateFc = new FormControl('', Validators.compose([Validators.required]));
    const preHourFc = new FormControl('', Validators.compose([Validators.required]));
    const preMiuFc = new FormControl('', Validators.compose([Validators.required]));
    const preSecFc = new FormControl('', Validators.compose([Validators.required]));
    const openFlagFc = new FormControl('', Validators.compose([Validators.required]));
    const openPrizeNameFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveActRecordForm = this.formBuilder.group({
      nodeCode: nodeCodeFc,
      itemCode: itemCodeFc,
      projectCode: dprojectCodeFc,
      actCode: actCodeFc,
      userId: userIdFc,
      tel: dtelFc,
      // time: timeFc,
      winStatus: winStatusFc,
      prizeName: prizeNameFc,
      prizeLevel: prizeLevelFc,
      sendFlag: sendFlagFc,
      prizeType: prizeTypeFc,
      selectedDate: selectedDateFc,
      preHourFc: preHourFc,
      preMiuFc: preMiuFc,
      preSecFc: preSecFc,
      openFlag: openFlagFc,
      openPrizeName: openPrizeNameFc,
    });
  }

  winStatusData: Array<any>= [{type: 0, value: '未中奖'}, {type: 1, value: '中奖'}, {type: 9, value: '已兑奖'}];
  openFlagData: Array<any>= [{type: 0, value: '未开奖'}, {type: 1, value: '已开奖'}];
  openPrizeNameData: Array<any>= [{type: 3, value: '刮刮卡'}];
  ngOnInit() {
    if (this.modalData !== '') {
      this.getDetail();
    } else {
      this.saveActRecordForm.patchValue({
        winStatus: this.winStatusData[0].type,
        openFlag: this.openFlagData[0].type,
        // openPrizeName: this.openPrizeNameData[0].type,
      });
    }
    // this.getProjects();
    // this.getProvinces();
    this.nodedetailAuth();
    this.saveActRecordForm.controls['prizeLevel'].disable();
    this.saveActRecordForm.controls['sendFlag'].disable();
    this.saveActRecordForm.controls['prizeType'].disable();
  }

  itemData: Array<any> = [];
  nodedetailAuth() {
    let that = this;
    this.activeBusinessService.projectAuth(function(data){
      if (data.length > 0) {
        that.projects = data;
      } else {
        that.projects = [];
      }
    });
  }

  getOthers() {
    let that = this;
    this.saveActRecordForm.patchValue({
      actCode: '',
      projectCode: '',
      itemCode: '',
      prizeName: '',
      prizeLevel:'',
      sendFlag: '',
      prizeType: '',
    });
    that.itemData = [];
    that.appointProduct = [];
    that.ActCodeData = [];
    that.prizeNameData = [];
    this.firstShow = false;
    this.secShow = false;
    this.saveActRecordForm.patchValue({winStatus: this.winStatusData[0].type});
    this.getItemList();
  }

  getItemList() {
    let that = this;
    let param = {itemCode: this.saveActRecordForm.getRawValue().nodeCode};
    // this.getRelatePri(param);
    this.activeBusinessService.getNodeList(param, function(data){
      if (data.length > 0) {
        that.itemData = data;
        if (that.modalData !== '' && that.saveActRecordForm.getRawValue().nodeCode === that.recordDetail.itemCode) {
          that.saveActRecordForm.patchValue({
            itemCode: that.recordDetail.nodeCode,
            projectCode: that.recordDetail.projectCode,
            actCode: that.recordDetail.actCode
          });
          that.getProjectList();
          that.getActCodeList();
        }
      } else {
        that.itemData = [];
      }
    });
  }
  getOtherProject() {
    let that = this;
    this.saveActRecordForm.patchValue({
      actCode: '',
      projectCode: '',
      prizeName: '',
      prizeLevel:'',
      sendFlag: '',
      prizeType: '',
    });
    that.appointProduct = [];
    that.ActCodeData = [];
    that.prizeNameData = [];
    this.firstShow = false;
    this.secShow = false;
    this.saveActRecordForm.patchValue({winStatus: this.winStatusData[0].type});
    this.getProjectList();
  }
  appointProduct: any;
  getProjectList() {
    let that = this;
    let param = {
      nodeCode: this.saveActRecordForm.getRawValue().itemCode,
      itemCode: this.saveActRecordForm.getRawValue().nodeCode,
    };
    this.activeBusinessService.getProjectList(param, function(data){
      if (data.length > 0) {
        that.appointProduct = data;
        if (that.modalData !== '' && that.saveActRecordForm.getRawValue().nodeCode === that.recordDetail.itemCode  && that.saveActRecordForm.getRawValue().itemCode === that.recordDetail.nodeCode) {
          that.saveActRecordForm.patchValue({
            projectCode: that.recordDetail.projectCode
          });
          that.getActCodeList();
        }
      } else {
        that.appointProduct = [];
      }
    });
  }

  getOtherAct() {
    let that = this;
    this.saveActRecordForm.patchValue({
      actCode: '',
      prizeName: '',
      prizeLevel: '',
      sendFlag: '',
      prizeType: '',
    });
    that.prizeNameData = [];
    this.firstShow = false;
    this.secShow = false;
    this.saveActRecordForm.patchValue({winStatus: this.winStatusData[0].type});
    this.getActCodeList();
  }
  ActCodeData: any;
  getActCodeList() {
    let that = this;
    that.ActCodeData = []
    let param = {
      itemCode: this.saveActRecordForm.getRawValue().nodeCode,
      nodeCode: this.saveActRecordForm.getRawValue().itemCode
    };
    this.activeBusinessService.getActCodeList(param, function(data){
      if (data.length > 0) {
        that.ActCodeData = data;
        if (that.modalData !== '' && that.saveActRecordForm.getRawValue().nodeCode === that.recordDetail.itemCode && that.saveActRecordForm.getRawValue().itemCode === that.recordDetail.nodeCode) {
          that.saveActRecordForm.patchValue({
            actCode: that.recordDetail.actCode,
          });
          that.getEditPrizeName();
        }
      } else {
        that.ActCodeData = [];
      }
    });
  }
  getEditPrizeName () {
    let that = this;
    if (that.modalData !== '' && that.saveActRecordForm.getRawValue().itemCode === that.recordDetail.nodeCode && that.saveActRecordForm.getRawValue().nodeCode === that.recordDetail.itemCode && that.saveActRecordForm.getRawValue().actCode === that.recordDetail.actCode && (this.recordDetail.winStatus === 1 ||  this.recordDetail.winStatus === 9)) {
      that.saveActRecordForm.patchValue({
        winStatus: that.recordDetail.winStatus,
      });
      that.getPrizeName();
    } else {
      this.saveActRecordForm.patchValue({
        prizeName: '',
        prizeLevel: '',
        sendFlag: '',
        prizeType: '',
      });
      this.firstShow = false;
      this.secShow = false;
      this.saveActRecordForm.patchValue({winStatus: this.winStatusData[0].type});
    }
  }
  recordDetail: any;
  getDetail() {
    if (this.modalData !== '') {
      let that = this;
      this.activeBusinessService.actRecordDetail({id: this.modalData}, function(data){
        that.recordDetail = data;
        let date = data.timeStr;
        let xxx = date.split(" ")[0].split("-");
        let xxxL = date.split(" ")[1].split(":");
        that.saveActRecordForm.patchValue({
          nodeCode: data.itemCode,
          itemCode: data.nodeCode,
          projectCode: data.projectCode,
          actCode: data.actCode,
          userId: data.userId,
          tel: data.tel,
          openFlag: data.openFlag,
          openPrizeName: data.openPrizeName,
          // time: this.time,
          selectedDate: {
            "year": parseInt (xxx[0]),
            "month": parseInt (xxx[1]),
            "day": parseInt (xxx[2])
          },
          preHourFc: xxxL[0],
          preMiuFc: xxxL[1],
          preSecFc: xxxL[2],
          winStatus: data.winStatus,
          prizeName: data.prizeName,
          prizeLevel: data.prizeLevel,
          sendFlag: data.sendFlagStr,
          prizeType: data.prizeTypeStr,
        });
        that.getItemList();
        that.getProjectList();
        that.getActCodeList();
        if (data.winStatus === 1 || data.winStatus === 9) {
          that.getPrizeName();
          if (data.prizeName !== null ) {
            that.getPrizeinfo();
          }
        }
      });
    }
  }

  getProjects() {
    let that = this;
    // this.activeBusinessService.getProjects(function(data){
    //   if (data.length > 0) {
    //     that.projects = data;
    //   } else {
    //     that.projects = [];
    //   }
    // });
  }

  updateProduct() {
    let that = this;
    let param = {projectCode: this.saveActRecordForm.getRawValue().projectCode};
    // this.activeBusinessService.getProducts(param, function(data){
    //   if (data.length > 0) {
    //     that.products = data;
    //   } else {
    //     that.products = [];
    //   }
    // });
  }

  getProvinces() {
    let that = this;
    // this.activeBusinessService.getProvinces(function(data){
    //   if (data.length > 0) {
    //     that.provinces = data;
    //   } else {
    //     that.provinces = [];
    //   }
    // });
  }

  preTimeFc: any = '';
  preHourFc: any = '';
  preMiuFc: any = '';
  preSecFc: any = '';
  insertTimeFc: any = '';
  ok(): void {
    let that = this;
    if ( (this.saveActRecordForm.getRawValue().winStatus === 1 ||  this.saveActRecordForm.getRawValue().winStatus === 9) && this.saveActRecordForm.getRawValue().prizeName === "" ) {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '奖品名称不能为空!', 2000));
      return;
    }
    if (this.saveActRecordForm.getRawValue().prizeName === "") {
      this.saveActRecordForm.removeControl('prizeName');
    }
    if (this.saveActRecordForm.getRawValue().prizeLevel === "") {
      this.saveActRecordForm.removeControl('prizeLevel');
    }
    if (this.saveActRecordForm.getRawValue().sendFlag === "") {
      this.saveActRecordForm.removeControl('sendFlag');
    }
    if (this.saveActRecordForm.getRawValue().prizeType === "") {
      this.saveActRecordForm.removeControl('prizeType');
    }
    this.preTimeFc = this.saveActRecordForm.controls["selectedDate"].value,
    this.preHourFc = this.saveActRecordForm.controls["preHourFc"].value,
    this.preMiuFc = this.saveActRecordForm.controls["preMiuFc"].value,
    this.preSecFc = this.saveActRecordForm.controls["preSecFc"].value
    if (typeof(this.preTimeFc) ==="object" && this.preTimeFc !=="" && this.preTimeFc !==null ) {
      this.preTimeFc = this.preTimeFc.year + "-" + this.preTimeFc.month + "-" + this.preTimeFc.day;
    }
    this.insertTimeFc = this.preTimeFc + " " + this.preHourFc + ":" + this.preMiuFc + ":" + this.preSecFc;
    let param: any = {
      openFlag: this.saveActRecordForm.getRawValue().openFlag,
      itemCode: this.saveActRecordForm.getRawValue().nodeCode,
      nodeCode: this.saveActRecordForm.getRawValue().itemCode,
      projectCode: this.saveActRecordForm.getRawValue().projectCode,
      actCode: this.saveActRecordForm.getRawValue().actCode,
      userId: this.saveActRecordForm.getRawValue().userId,
      tel: this.saveActRecordForm.getRawValue().tel,
      dateTimeStr: this.insertTimeFc,
      winStatus: this.saveActRecordForm.getRawValue().winStatus,
      prizeName: this.saveActRecordForm.getRawValue().prizeName,
      prizeLevel: this.saveActRecordForm.getRawValue().prizeLevel,
      openPrizeName: this.saveActRecordForm.getRawValue().openPrizeName,
    };
    if (this.secShow) {
      param.sendFlag = this.prizeInfoData[0].sendFlag;
      param.prizeType = this.prizeInfoData[0].prizeType;
    }
    if (this.modalData !== '') {
      param.id = that.recordDetail.id;
    }
    if (this.saveActRecordForm.valid) {
      this.activeBusinessService.actRecordSave(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功', 3000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }


  firstShow = false;
  secShow = false;
  getPrize() {
    this.saveActRecordForm.patchValue({
      prizeName: '',
      prizeLevel: '',
      sendFlag: '',
      prizeType: '',
    })
    // if ( this.saveActRecordForm.getRawValue().winStatus === 1 ||  this.saveActRecordForm.getRawValue().winStatus === 9 || this.recordDetail.winStatus === 1 || this.recordDetail.winStatus === 9 ) {
    if ( this.saveActRecordForm.getRawValue().winStatus === 1 ||  this.saveActRecordForm.getRawValue().winStatus === 9 ) {
      this.getPrizeName();
    } else {
      this.firstShow = false;
      this.secShow = false;
    }
  }
  prizeNameData: Array<any> = [];
  getPrizeName() {
    let that = this;
    this.firstShow = true;
    that.prizeNameData = [];
    let param = {
      itemCode: this.saveActRecordForm.getRawValue().nodeCode,
      nodeCode: this.saveActRecordForm.getRawValue().itemCode,
      actCode: this.saveActRecordForm.getRawValue().actCode,
    };
    this.activeBusinessService.getPrizeList(param, function(data){
      if (data.length > 0) {
        that.prizeNameData = data;
        if (that.modalData !== '' && that.recordDetail.prizeName !== null && that.saveActRecordForm.getRawValue().itemCode == that.recordDetail.nodeCode && that.saveActRecordForm.getRawValue().nodeCode == that.recordDetail.itemCode && that.saveActRecordForm.getRawValue().actCode == that.recordDetail.actCode) {
          that.saveActRecordForm.patchValue({
            prizeName: that.recordDetail.prizeName,
          });
          that.getEditPrizeInfo();
        }
      } else {
        that.prizeNameData = [];
      }
    });
  }
  getEditPrizeInfo(){
    let that = this;
    if (this.modalData !== '' && this.saveActRecordForm.getRawValue().prizeName == this.recordDetail.prizeName && that.saveActRecordForm.getRawValue().nodeCode == that.recordDetail.itemCode && that.saveActRecordForm.getRawValue().itemCode == that.recordDetail.nodeCode) {
      this.getPrizeinfo();
    }
  }
  prizeInfoData: Array<any> = [];
  getPrizeinfo() {
    let that = this;
    that.prizeInfoData = [];
    this.secShow = true;
    let param = {
      id: this.saveActRecordForm.getRawValue().prizeName,
    };
    this.activeBusinessService.getPrizeInfoById(param, function(data){
      if (data.length > 0) {
        that.prizeInfoData = data;
        that.saveActRecordForm.patchValue({
          prizeLevel: data[0].prizeLevel,
          sendFlag: data[0].sendFlagStr,
          prizeType: data[0].prizeTypeStr,
        })
      } else {
        that.prizeInfoData = [];
      }
    });
  }
}
