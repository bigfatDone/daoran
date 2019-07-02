import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { ModalService } from '../../shared/modal/modal.service';
import {artArea, artType} from '../../global-constant';
// import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {programType, freeFlag, categoryAttr} from '../../global-constant';
import {ResourcesBusinessService} from '../../business-service/resources/resources-business.service';
import {ActivatedRoute, Router} from '@angular/router';
import {VideoArtrelateComponent} from './video-artrelate.component';
import {environment} from '../../../environments/environment';
import {AppService} from '../../app.service';


@Component({
  selector: 'c-audio-detail',
  templateUrl: './audio-detail.component.html',
  styleUrls: ['./audio-detail.component.scss'],
})
export class AudioDetailComponent implements OnInit {

  //editVideoForm: FormGroup;
  windowUrl:any;
  detailId:any;
  showImg: any = "";
  artAreas: Array<any> = artArea;
  artTypes: Array<any> = artType;

  options: any = {
    axis: 'y',
    theme: 'minimal-dark',
    autoDraggerLength: true,
    advanced: {
      updateOnContentResize: true
    },
  };

  // 详情页渲染参数
  SartArea: any = "";
  SartCodeName: any = "";
  SartName: any = "";
  SbeDate: any = "";
  SenDate: any = "";
  SallTime: any = "";
  ScpIdName: any = "";
  SaudCode: any = "";
  SvidType: any = "";
  SaudName: any = "";
  SaudtitleName: any = "";
  Sresolution: any = "";
  Sdes: any = "";

  modalData: any = "";
  constructor(
              // public activeModal: NgbActiveModal,
              public resourcesBusinessService: ResourcesBusinessService, private toastService: ToastService, private formBuilder: FormBuilder, private modalService: ModalService,
              // private commonBusinessService: CommonBusinessService,
              private ngbModalService: NgbModal,
              private router: Router,
              private actRoute: ActivatedRoute,
              private appService: AppService,) {
    this.appService.titleEventEmitter.emit("音频详情");
    this.windowUrl = this.router.url;
  }

  ngOnInit() {
    if(this.actRoute.snapshot.params['id']){
      this.detailId = this.actRoute.snapshot.params['id'];
    }
    this.getDetail();
    this.getArtInfo ();
    this.play();
    this.showImg = environment.imgApiShow;
  }


  detailInfo: any;
  imageData: any;
  artData: Array<any> = [];
  arrArtAreas: Array<any> = [];
  arrArtTypes: Array<any> = [];
  getDetail() {
    let that = this;
    let param = {jsonParam:JSON.stringify({audioCode: this.detailId})};
    this.resourcesBusinessService.audioInfo(param, function(data){
      that.detailInfo = data.data;
      that.imageData = data.data.imageList;
      that.artData = data.data.artistList;



      // 详情页渲染参数
      that.alubumFc = data.data.albumName;
      that.SallTime = data.data.allTime;
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
      that.SaudCode = data.data.audioCode;
      that.SaudName = data.data.audioName;
      that.SaudtitleName = data.data.audioName;
      that.arrangerFc = data.data.arranger;
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

  imgSrcA: any = "";
  imgSrcB: any = "";
  imgSrcC: any = "";
  imgSrcD: any = "";
  imgSrcE: any = "";
  imgSrcF: any = "";
  imgSrcG: any = "";
  imgSrcH: any = "";
  inputFileA: any = "";
  inputFileB: any = "";
  inputFileC: any = "";
  inputFileD: any = "";
  inputFileE: any = "";
  inputFileF: any = "";
  inputFileG: any = "";
  inputFileH: any = "";
  newFile: any = new FormData();
  // upload(ev, index) {
  //   let file = ev.srcElement.files[0];
  //   this.newFile.set("file"+index, file);
  //   let that = this;
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function(event) {
  //     switch (index) {
  //       case 'A':
  //         that.imgSrcA = this.result;
  //         break;
  //       case 'B':
  //         that.imgSrcB = this.result;
  //         break;
  //       case 'C':
  //         that.imgSrcC = this.result;
  //         break;
  //       case 'D':
  //         that.imgSrcD = this.result;
  //         break;
  //       case 'E':
  //         that.imgSrcE = this.result;
  //         break;
  //       case 'F':
  //         that.imgSrcF = this.result;
  //         break;
  //       case 'G':
  //         that.imgSrcG = this.result;
  //         break;
  //       case 'H':
  //         that.imgSrcH = this.result;
  //         break;
  //     }
  //   };
  // }
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

  bgServiceUrl: any="";
  tpServiceUrl: any="";
  upload(ev) {
    let file = ev.target.files[0];
    if (file) {
      let param = new FormData();
      let that = this;
      param.append("file", file);
      param.append("videoCode", this.detailInfo.videoCode);
      this.resourcesBusinessService.uploadPicPost(param, function(data){
        that.imgSrcA =environment.imgApi + data.data.path;
      });
    }
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
    //let categoryVal = this.getCategory();
    // if (this.editVideoForm.valid ) {
    if(typeof(this.pubTimeFc) ==="object" && this.pubTimeFc !=="" && this.pubTimeFc !==null){
      this.pubTimeFc = this.pubTimeFc.year + "-" + this.pubTimeFc.month + "-" + this.pubTimeFc.day;
      // this.enDate = this.enDate.year + "-" + this.enDate.month + "-" + this.enDate.day;
    }
    param =  {
      audioCode: this.SaudCode,
      audioName: this.SaudName,
      des: this.Sdes,
      foreignName: this.foreignNameFc,
      language: this.languageFc,
      publishArea: this.pubAreaFc,
      lyricist: this.lyrFc,
      composer: this.composerFc,
      producer: this.producerFc,
      directorMV: this.dirMVFc,
      albumName: this.alubumFc,
      publishTime: this.pubTimeFc,
      // publishArea: this.pubAreaFc,
      recordCompany: this.recordFc,
      arranger: this.arrangerFc,
      //eleCategory: categoryVal,
    };
    param = {jsonParam:JSON.stringify(param)};
    this.resourcesBusinessService.audioSave(param, function(data){
      const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
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
    let param= {audioCode: this.detailId};
    params={jsonParam:JSON.stringify(param)};
    this.resourcesBusinessService.audioPlay(params, function(data){
      // const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
      // that.toastService.toast(toastCfg);
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
