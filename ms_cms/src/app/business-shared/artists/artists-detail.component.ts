import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppService } from '../../app.service';
import { ArtistsBusinessService} from '../../business-service/artists/artists-business.service';
import {artArea, artType} from '../../global-constant';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {VideoArtrelateComponent} from '../resources/video-artrelate.component';
import {ConfirmConfig} from '../../shared/modal/modal-model';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {ModalService} from '../../shared/modal/modal.service';
import {ToastService} from '../../shared/toast/toast.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../../environments/environment';
@Component({
  selector: 'c-artists-detail',
  templateUrl: './artists-detail.component.html',
  styleUrls: ['./artists-detail.component.scss']
})

export class ArtistsDetailComponent implements OnInit {
  windowUrl:any;
  artAreas: Array<any>= artArea;
  artTypes: Array<any>= artType;

  // 详情页渲染参数
  SartArea: any = "";
  SartCodeName: any = "";
  SartName: any = "";
  SartTitleName: any = "";
  StitleImg: any = "";
  SbeDate: any = "";
  SenDate: any = "";
  SallTime: any = "";
  ScpIdName: any = "";
  SvidCode: any = "";
  SvidType: any = "";
  SvidName: any = "";
  Sresolution: any = "";
  Sdes: any = "";
  SaudioCount: any = "";
  SvideoCount: any = "";
  showImg: any = "";
  date: any = "";
  detailId: any = "";

  modalData: any = "";
  constructor(
              // public activeModal: NgbActiveModal,
              public artistsBusinessService: ArtistsBusinessService, private toastService: ToastService, private formBuilder: FormBuilder, private modalService: ModalService,
              // private commonBusinessService: CommonBusinessService,
              private ngbModalService: NgbModal,
              private router: Router,
              private routerModule: RouterModule,
              private actRoute: ActivatedRoute,
              private appService: AppService,) {
    this.appService.titleEventEmitter.emit("艺人详情");
    // this.editArtistsForm = this.formBuilder.group({
    // artTypeContrl: artTypeFc,
    // artAreaContrl: artAreaFc
    // });
    this.windowUrl = this.router.url;
  }

  ngOnInit() {
    if(this.actRoute.snapshot.params['id']){
      this.detailId = this.actRoute.snapshot.params['id'];
    }
    this.showImg = environment.imgApiShow;
    this.getDetail();
  }

  nodeList: Array<any>= [];

  eleAttrs: Array<any>= [];
  eleAttrStr: any;



  checkNode($event, index) {
    this.eleAttrs[index].checkState = $event.target.checked;
  }
  detailInfo: any;
  imageData: any;
  artData: any;
  getDetail() {
    this.imgSrcA = "";
    let that = this;
    let param = {jsonParam:JSON.stringify({artistCode: this.detailId})};
    this.artistsBusinessService.artistsInfo(param, function(data){
      that.detailInfo = data.data;
      that.imageData = data.data.images;
      that.artData = data.data.artistList;

      // 详情页渲染参数
      that.SartCode = data.data.artistCode,
      that.SartName = data.data.artistName,
      that.SartTitleName = data.data.artistName,
      that.StitleImg = data.data.artistImage,
      that.SartType = data.data.artistType,
      that.SforeignName = data.data.foreignName,
      that.Salias =data.data.alias,
      that.Scountry = data.data.country,
      that.Snation = data.data.nation,
      that.SstarSign = data.data.starSign,
      that.SanimalSign = data.data.animalSign,
      that.SartArea = data.data.artistArea,
      that.SbirthArea = data.data.birthArea,
      that.Sbirthday = data.data.birthday,
      that.Soccupation = data.data.occupation,
      that.SgraduateUnvers = data.data.graduateUnvers,
      that.Sibec = data.data.ibec,
      that.Srepresentative = data.data.representative,
      // recordCompany:this.SrecordCompany = ,
      that.Sdes = data.data.des,
      that.SaudioCount = data.data.audioCount,
      that.SvideoCount = data.data.videoCount,
      that.SenDate = data.data.lastTime

      // const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
      // that.toastService.toast(toastCfg);
    });
  }

  getDrawPicInfo() {
    this.imgSrcA = "";
    let that = this;
    let param;
    param = {jsonParam:JSON.stringify({artistCode: this.detailId})};
    this.artistsBusinessService.getArtPicDetail(param, function(data){
      that.imageData = data.data.images;

      // const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
      // that.toastService.toast(toastCfg);
    });

  }
  chooseArtistModal: any = null;
  imgSrcA: any = "";
  upload(ev) {
    this.date = new Date().getTime();
    let file = ev.target.files[0];
    if (file) {
      let param = new FormData();
      let that = this;
      param.append("file", file);
      param.append("artistCode", this.detailInfo.artistCode);
      this.artistsBusinessService.uploadPicPost(param, function(data){
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
      artistCode:this.SartCode,
      imageCode:id,
    }
    const confirmCfg = new ConfirmConfig('确认设为默认？');
    this.modalService.confirm(confirmCfg).then((result) => {
      that.artistsBusinessService.setDefaultPic({jsonParam:JSON.stringify(param)}, function(data){
        that.getDetail();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000));
      });
    }, (reason) => {
    });
  }

  delPic(id){
    let that = this;
    const confirmCfg = new ConfirmConfig('确认删除图片？');
    this.modalService.confirm(confirmCfg).then((result) => {
        that.artistsBusinessService.delArtistPic({jsonParam:JSON.stringify({imageCode: id})}, function(data){
          that.getDrawPicInfo();
          that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000));
        });
    }, (reason) => {});
  }
  SartCode: any = "";
  // SartName: any = "";
  desFc: any = "";
  foreignNameFc: any = "";
  languageFc: any = "";
  SgraduateUnvers: any = "";
  Scountry: any = "";
  Sbirthday: any = "";
  SartType: any = "";
  SbirthArea: any = "";
  alubumFc: any = "";
  pubTimeFc: any = "";
  SanimalSign: any = "";
  Salias: any = "";
  Sibec: any = "";
  Snation: any = "";
  Soccupation: any = "";
  Srepresentative: any = "";
  SstarSign: any = "";
  SforeignName: any = "";
  SrecordCompany: any = "";
  ok(): void {
    let that = this;
    let param: any;
    if(typeof(this.Sbirthday) ==="object" && this.Sbirthday !=="" && this.Sbirthday !==null){
      this.Sbirthday = this.Sbirthday.year + "-" + this.Sbirthday.month + "-" + this.Sbirthday.day;
      // this.enDate = this.enDate.year + "-" + this.enDate.month + "-" + this.enDate.day;
    }
    param =  {
      artistCode: this.SartCode,
      artistName: this.SartName,
      artistType: this.SartType,
      foreignName: this.SforeignName,
      alias: this.Salias,
      country: this.Scountry,
      nation: this.Snation,
      starSign: this.SstarSign,
      animalSign: this.SanimalSign,
      artistArea:this.SartArea,
      birthArea: this.SbirthArea,
      birthday: this.Sbirthday,
      occupation: this.Soccupation,
      graduateUnvers: this.SgraduateUnvers,
      ibec: this.Sibec,
      representative: this.Srepresentative,
      // recordCompany:this.SrecordCompany,
      des: this.Sdes,

    };
    param = {jsonParam:JSON.stringify(param)};
    this.artistsBusinessService.artistsSave(param, function(data){
      const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
      that.toastService.toast(toastCfg);
      that.getDetail();
    });
  }

  /**
   * 关闭
   */
  close(): void {
    // this.activeModal.dismiss({ status: 'closed' });
  }

  toggle(type){
    if(type === "video"){
      this.router.navigate(['/app/resources/videoList',this.SartCode]);
    }
    if(type === "audio"){
      this.router.navigate(['/app/resources/audioList', this.SartCode]);
    }
  }
  // playUrl: any = "";
  // play(){
  //   let that = this;
  //   let params;
  //   let param= {videoCode: this.SvidCode};
  //   params={jsonParam:JSON.stringify(param)};
  //   this.artistsBusinessService.videoPlay(params, function(data){
  //     that.playUrl = data.data.url;
  //     window.open(that.playUrl);
  //   });
  // }
}
