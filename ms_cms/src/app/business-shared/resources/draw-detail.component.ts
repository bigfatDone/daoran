// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { AppService } from '../../app.service';
// import { ResourcesBusinessService} from '../../business-service/resources/resources-business.service';
//
// @Component({
//   selector: 'c-draw-detail',
//   templateUrl: './draw-detail.component.html'
// })
// export class DrawDetailComponent implements OnInit {
//   dataDetail: any;
//
//   detailId: any;
//
//   constructor(private appService: AppService,
//               private resourcesBusinessService: ResourcesBusinessService,
//               private actRoute: ActivatedRoute,
//               ) {
//     this.appService.titleEventEmitter.emit("手绘本详情");
//   }
//
//   ngOnInit() {
//     this.getInfo();
//     this.detailId = this.actRoute.snapshot.params['id'];
//   }
//
//   getInfo() {
//     let that = this;
//     let params = {};
//     this.resourcesBusinessService.drawInfo(params, function(data){
//       if (data.obj) {
//         that.dataDetail = data.obj;
//       }
//     });
//   }
// }
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { AppService } from '../../app.service';
// import { ResourcesBusinessService} from '../../business-service/resources/resources-business.service';
//
// @Component({
//   selector: 'c-video-detail',
//   templateUrl: './video-detail.component.html'
// })
// export class VideoDetailComponent implements OnInit {
//   dataDetail: any;
//
//   detailId: any;
//
//   constructor(private appService: AppService,
//               private resourcesBusinessService: ResourcesBusinessService,
//               private actRoute: ActivatedRoute,
//               ) {
//     this.appService.titleEventEmitter.emit("视频详情");
//   }
//
//   ngOnInit() {
//     this.getInfo();
//     this.detailId = this.actRoute.snapshot.params['id'];
//   }
//
//   getInfo() {
//     let that = this;
//     let params = {};
//     this.resourcesBusinessService.videoInfo(params, function(data){
//       if (data.obj) {
//         that.dataDetail = data.obj
//       }
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { ModalService } from '../../shared/modal/modal.service';
import { ActivatedRoute } from '@angular/router';
// import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {programType, freeFlag, categoryAttr, basicPatInfo, artType, artArea} from '../../global-constant';
import {ResourcesBusinessService} from '../../business-service/resources/resources-business.service';
import {Router} from '@angular/router';
import {VideoArtrelateComponent} from './video-artrelate.component';
import {environment} from '../../../environments/environment';
import {AppService} from '../../app.service';


@Component({
  selector: 'c-draw-detail',
  templateUrl: './draw-detail.component.html',
  styleUrls: ['./draw-detail.component.scss'],
})
export class DrawDetailComponent implements OnInit {

  //editVideoForm: FormGroup;
  windowUrl:any;
  artAreas: Array<any> = artArea;
  artTypes: Array<any> = artType;
  options: any = {
    // setWidth: false,
    // setHeight: 300,
    axis: 'y',
    theme: 'minimal-dark',
    autoDraggerLength: true,
    advanced: {
      updateOnContentResize: true
    },
  };


  modalData: any = "";
  showImg: any = "";
  detailId: any = "";
  date: any = "";
  constructor(
    // public activeModal: NgbActiveModal,
    public resourcesBusinessService: ResourcesBusinessService, private toastService: ToastService, private formBuilder: FormBuilder, private modalService: ModalService,
    private ngbModalService: NgbModal,
    private actRoute: ActivatedRoute,
    private router: Router,
    private appService: AppService,) {
    this.appService.titleEventEmitter.emit("手绘本详情");
    this.windowUrl = this.router.url;
  }

  ngOnInit() {
    if(this.actRoute.snapshot.params['id']){
      this.detailId = this.actRoute.snapshot.params['id'];
    }
    this.showImg = environment.imgApiShow;
    this.getDetail();
    this.getArtInfo ();
    this.play();
  }
  SartArea: any = "";
  SartCodeName: any = "";
  SartName: any = "";
  SbeDate: any = "";
  SenDate: any = "";
  SallTime: any = "";
  ScpIdName: any = "";
  SvidCode: any = "";
  SvidtitleCode: any = "";
  SvidType: any = "";
  SvidName: any = "";
  StitleName: any = "";
  StitleImg: any = "";
  Sresolution: any = "";
  Sdes: any = "";
  SpaintCode: any = "";
  SpaintName: any = "";
  defaultFlag = false;

  detailInfo: any;
  imageData: Array<any> = [];
  artData: Array<any> = [];
  firstFlag = true;
  arrArtAreas: Array<any> = [];
  arrArtTypes: Array<any> = [];
  getDetail() {
    this.imgSrcA = "";
    let that = this;
    let param;

    //draw 手绘本详情
      param = {jsonParam:JSON.stringify({paintCode: this.detailId})};
      this.resourcesBusinessService.drawInfo(param, function(data){
        that.detailInfo = data.data;
        that.imageData = data.data.images;
        // that.artData = data.data.relevanceList;

        // 详情页渲染参数
        that.alubumFc = data.data.albumName;
        that.SbeDate = data.data.allTime;
        that.composerFc = data.data.composer;
        that.ScpIdName = data.data.cpId;
        that.Sdes = data.data.des;
        that.dirMVFc = data.data.directorMV;
        that.foreignNameFc = data.data.foreignName;
        that.languageFc = data.data.language;
        that.SenDate = data.data.lastTime;
        that.lyrFc = data.data.lyricist;
        that.producerFc = data.data.producer;
        that.pubAreaFc = data.data.publishArea;
        that.pubTimeFc = data.data.publishTime;
        that.recordFc = data.data.redordCompany;
        that.Sresolution = data.data.resolution;
        that.SvidCode = data.data.paintCode;
        that.SvidtitleCode = data.data.paintCode;
        that.SvidName = data.data.paintName;
        that.StitleName = data.data.paintName;
        that.StitleImg = data.data.paintImage;
        that.arrangerFc = data.data.arranger;

        //   displayType === "1"){
        //   that.defaultFlag = true;
        // }

        // const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
        // that.toastService.toast(toastCfg);
      });


  }
  getArtInfo() {
    this.imgSrcA = "";
    let that = this;
    let param;
    param = {jsonParam:JSON.stringify({resCode: this.detailId})};
    this.resourcesBusinessService.getRelevanceList(param, function(data){
      that.artData = data.data;
      that.arrArtAreas = [];
      that.arrArtTypes = [];
      that.artData.forEach(i => {
        for (let j of that.artAreas) {
          if (i.artistType === j.type) {
            that.arrArtAreas.push(j.name)
          }
        }
        for (let j of that.artTypes) {
          if (i.artistArea === j.type) {
            that.arrArtTypes.push(j.name)
          }
        }

      })

      // const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
      // that.toastService.toast(toastCfg);
    });

  }



  chooseArtistModal: any = null;
  addRelation(){
    let that = this;
    this.chooseArtistModal = this.ngbModalService.open(VideoArtrelateComponent, {size: 'lg'});
    this.chooseArtistModal.componentInstance.chooseArtistData = this.detailInfo;
    this.chooseArtistModal.result.then((result) => {
      if(result === "ok"){
        this.getArtInfo()
      }
      }, (reason) => {
    });
  }

  getDrawPicInfo() {
    this.imgSrcA = "";
    let that = this;
    let params;
    let param = {paintCode: this.detailId};
    params = {jsonParam:JSON.stringify(param)};
    this.resourcesBusinessService.getDrawPicDetail(params, function(data){
      that.imageData = data.data.imageList;

      // const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
      // that.toastService.toast(toastCfg);
    });

  }

  imgSrcA: any = "";
  upload(ev) {
    this.date = new Date().getTime();
    let file = ev.target.files[0];
    if (file) {
      let param = new FormData();
      let that = this;
      param.append("file", file);
        param.append("paintCode", this.detailInfo.paintCode);
        this.resourcesBusinessService.uploadPaintPic(param, function(data){
          if(data.data.path){
            that.imgSrcA =environment.imgApi + data.data.path;
            that.getDrawPicInfo()
          }
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
          that.toastService.toast(toastCfg);
        });


    }
  }

  setDefault(id){
    let that = this;
    let param;
    param = {
      paintCode:this.SvidCode,
      imageCode:id,
    }
    const confirmCfg = new ConfirmConfig('确认设为默认？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.resourcesBusinessService.setDefaultPaiPic({jsonParam:JSON.stringify(param)}, function(data){
        that.getDetail();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000));
      });
    }, (reason) => {
    });
  }

  delPic(id){
    let that = this;
    const confirmCfg = new ConfirmConfig('确认删除图片？');
    // if(this.modalData.flag === "video"){
    //   this.modalService.confirm(confirmCfg).then((result) => {
    //     that.resourcesBusinessService.delVideoPic({jsonParam:JSON.stringify({imageCode: id})}, function(data){
    //       that.getDetail();
    //       that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000));
    //     });
    //   }, (reason) => {});
    // }
    // if(this.modalData.flag === "draw"){
      this.modalService.confirm(confirmCfg).then((result) => {
        that.resourcesBusinessService.delDrawPic({jsonParam:JSON.stringify({imageCode: id})}, function(data){
          that.getDrawPicInfo();
          that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000));
        });
      }, (reason) => {});
  }
  videoCodeFc: any = "";
  videoNameFc: any = "";
  foreignNameFc: any = "";
  languageFc: any = "";
  pubArea: any = "";
  lyrFc: any = "";
  composerFc: any = "";
  producerFc: any = "";
  dirMVFc: any = "";
  alubumFc: any = "";
  pubTimeFc: any = "";
  pubAreaFc: any = "";
  recordFc: any = "";
  arrangerFc: any = "";
  ok(): void {
    let that = this;
    let param: any;
    // if(this.modalData.flag === "video"){
    //   param =  {
    //     videoCode: this.SvidCode,
    //     videoName: this.SvidName,
    //     des: this.Sdes,
    //     foreignName: this.foreignNameFc,
    //     language: this.languageFc,
    //     publishArea: this.pubArea,
    //     lyricist: this.lyrFc,
    //     composer: this.composerFc,
    //     producer: this.producerFc,
    //     directorMV: this.dirMVFc,
    //     albumName: this.alubumFc,
    //     publishTime: this.pubTimeFc,
    //     publicshArea: this.pubAreaFc,
    //     recordCompany: this.recordFc,
    //   };
    //   param = {jsonParam:JSON.stringify(param)};
    //   this.resourcesBusinessService.videoSave(param, function(data){
    //     const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
    //     that.toastService.toast(toastCfg);
    //     that.close();
    //   });
    // }
    // if(this.modalData.flag === "draw"){
    if(typeof(this.pubTimeFc) ==="object" && this.pubTimeFc !==""  && this.pubTimeFc !==null){
      this.pubTimeFc = this.pubTimeFc.year + "-" + this.pubTimeFc.month + "-" + this.pubTimeFc.day;
      // this.enDate = this.enDate.year + "-" + this.enDate.month + "-" + this.enDate.day;
    }
      param =  {
        paintCode: this.SvidCode,
        paintName: this.SvidName,
        des: this.Sdes,
        foreignName: this.foreignNameFc,
        language: this.languageFc,
        // publishArea: this.pubArea,
        lyricist: this.lyrFc,
        composer: this.composerFc,
        producer: this.producerFc,
        directorMV: this.dirMVFc,
        albumName: this.alubumFc,
        publishTime: this.pubTimeFc,
        publishArea: this.pubAreaFc,
        recordCompany: this.recordFc,
        arranger: this.arrangerFc,
      };
      param = {jsonParam:JSON.stringify(param)};
      this.resourcesBusinessService.drawSave(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
        that.toastService.toast(toastCfg);
        that.getDetail();
      });


    // } else {
    //   that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整信息!', 2000));
    // }
  }
  del(id) {
    let that = this;
    const confirmCfg = new ConfirmConfig('是否确认删除？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.resourcesBusinessService.delRelevanceArtist({jsonParam:JSON.stringify({sid: id})}, function(data){
        that.getArtInfo();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000));
      });
    }, (reason) => {

    });
  }
  playUrl: any = "";
  playFlag = false;
  play(){
    let that = this;
    let params;
    let param= {paintCode: this.detailId};
    params={jsonParam:JSON.stringify(param)};
    this.resourcesBusinessService.drawPlay(params, function(data){
      if(data.msg==="该资源暂无播放地址"){
        that.playFlag = true;
      }else {
        that.playUrl = data.data.url;
      }
      });
  }
  /**
   * 关闭
   */
  close(): void {
    // this.activeModal.dismiss({ status: 'closed' });
  }
}

