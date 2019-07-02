import {Component, OnDestroy, OnInit} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { ProgramBusinessService } from '../../business-service/program/program-business.service';

import { programType, pageResType, resourceSort, sectData} from "../../global-constant";
import {Router} from '@angular/router';
import {ElementConfirSaveComponent} from '../page/element-confirSave.component';
import {AlbumBusinessService} from '../../business-service/album/album-business.service';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'c-album-add',
  templateUrl: './album-add.component.html',
  styleUrls: ['./album-add.component.scss']
})
export class AlbumAddComponent implements OnInit, OnDestroy {
  albumType: Array<any> = [{type: 1, name: "音乐MV"}, {type: 2, name: "儿童歌曲"}, {type: 3, name: "儿童教育"}, {type: 4, name: "戏曲"}, {type: 5, name: "手绘本"}];
  albumResType: Array<any> = [{type: 1, name: "视频"}, {type: 2, name: "音频"}, {type: 3, name: "手绘本"}];
  freeFlagData: Array<any> = [{type: 0, name: "收费"}, {type: 1, name: "免费"}];
  addAlbummForm: FormGroup;

  // listTypes: any = sectData;
  listTypes: Array<any> = [];
  listType: any = "";
  modalData: any = "";
  windowUrl: any;
  drawFlag = true;

  constructor(public activeModal: NgbActiveModal,
              public albumBusinessService: AlbumBusinessService,
              public commonBusinessService: CommonBusinessService,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private router: Router,
              private ngbModalService: NgbModal ) {
    const nameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const codeFc = new FormControl('', Validators.compose([CustomValidators.numLetterUnderline, Validators.minLength(1), Validators.maxLength(32)]));
    const sectFc = new FormControl('', Validators.compose([Validators.required]));
    const upperCaseFc = new FormControl('', Validators.compose([Validators.required]));
    const alTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const alResTypeFc = new FormControl('', Validators.compose([Validators.required]));
    const freeFlagFc = new FormControl('', Validators.compose([Validators.required]));
    const publishTimeFc = new FormControl('', Validators.compose([]));
    const desFc = new FormControl('', Validators.compose([]));
    const bgUrlFc = new FormControl('', Validators.compose([]));

    this.addAlbummForm = this.formBuilder.group({
      albumCode: codeFc,
      albumName: nameFc,
      sect: sectFc,
      upperCase: upperCaseFc,
      alType: alTypeFc,
      alResType: alResTypeFc,
      freeFlag: freeFlagFc,
      publishTime: publishTimeFc,
      albumDesc: desFc,
      bgUrl: bgUrlFc,
    });
    this.windowUrl = this.router.url;
    if (this.windowUrl.indexOf("draw/programList")>= 0) {
      this.drawFlag = false;
    }
  }
  imgApi: any;
  ngOnInit() {
    this.imgApi = environment.imgApi;
    this.getAllSectList();
    this.getDetail();
    if (this.modalData !== '') {
      this.addAlbummForm.controls['alResType'].disable();
      this.addAlbummForm.patchValue({
        albumName: this.modalData.albumName,
        sect: this.modalData.sect,
        upperCase: this.modalData.upperCase,
        albumDesc: this.modalData.albumDesc,
        bgUrl: this.modalData.image,
      });
      if (this.modalData.publishTimeStr !== null){
        let date = this.modalData.publishTimeStr;
        let xxx = date.split(" ")[0].split("-");
        this.addAlbummForm.patchValue({
          publishTime: {
            "year": parseInt (xxx[0]),
            "month": parseInt (xxx[1]),
            "day": parseInt (xxx[2])
          },
        });
      }
      if (this.modalData.image === null || this.modalData.image ==='' ){
        this.bgServiceUrl = '';
      } else {
        this.bgServiceUrl = this.imgApi + this.modalData.image;
      }
    } else {
      this.addAlbummForm.patchValue({
        alType: this.albumType[0].type,
        alResType: this.albumResType[0].type,
        freeFlag: this.freeFlagData[0].type,
      })
    }

  }

  ngOnDestroy() {
    if (this.programConfirModal !== null) {
      this.programConfirModal.close();
    }
  }

  nodeList: Array<any>= [];
  programTypes: Array<any>= programType;
  pageResTypes: Array<any>= pageResType.slice(1, pageResType.length);
  hdbpageResTypes: Array<any>= pageResType.slice(3, pageResType.length);
  resourceSorts: Array<any>= resourceSort;

  getDetail() {
    if (this.modalData !== "") {
      let that = this;
      let param = {albumCode: this.modalData.albumCode};
      this.albumBusinessService.getAlbumDetail(param, function(data){
        that.addAlbummForm.patchValue({
          albumName: data.albumName,
          sect: data.sect,
          upperCase: data.upperCase,
          alType: data.albumCategory,
          alResType: data.resType,
          freeFlag: data.freeFlag,
        });
        if (data.publishTimeStr !== null){
          let date = data.publishTimeStr;
          let xxx = date.split(" ")[0].split("-");
          that.addAlbummForm.patchValue({
            publishTime: {
              "year": parseInt (xxx[0]),
              "month": parseInt (xxx[1]),
              "day": parseInt (xxx[2])
            },
          });
        }
        // that.addAlbummForm.controls['code'].disable();
        // that.addAlbummForm.controls['pageResType'].disable();
      });
    }
  }

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
  getNodeDetail() {
    if (this.modalData !== "") {
      let that = this;
      let param = {listCode: this.modalData};
      let selectNode = [];
      this.albumBusinessService.getProgramNodeDetail(param, function (data) {
        data.forEach(i => selectNode.push(i.nodeCode));
        that.nodeList.forEach(i => {
          if (selectNode.indexOf(i.nodeCode) > -1) {
            i.checkState = true;
          }
        });
      });
    }
  }

  bannerData: any = "";
  bgServiceUrl: any="";
  uploadFile(ev, type) {
    let file = ev.target.files[0];
    if (file) {
      let param = new FormData();
      let that = this;
      param.append("file", file);
      param.append("type", type);
      this.commonBusinessService.uploadPicPost(param, function(data){
        that.addAlbummForm.patchValue({"bgUrl": data});
        that.bgServiceUrl = environment.imgApi + data;
      });
    }
  }

  getNodeList() {
    let that = this;
    this.albumBusinessService.getNodes(function(data) {
      that.nodeList = data;
      that.getNodeDetail();
    });
  }
  programConfirModal: any = null;
  preTimeFc: any;
  ok(): void {
    let that = this;
    let param: any;
    // let selectNodes: Array<any>= [];
    if (!!this.addAlbummForm.controls["publishTime"].value) {
      this.preTimeFc = this.addAlbummForm.controls["publishTime"].value;
      if (typeof(this.preTimeFc) ==="object" && this.preTimeFc !=="" && this.preTimeFc !==null ) {
        this.preTimeFc = this.preTimeFc.year + "-" + this.preTimeFc.month + "-" + this.preTimeFc.day;
        // this.enDate = this.enDate.year + "-" + this.enDate.month + "-" + this.enDate.day;
      }
    } else {
      this.addAlbummForm.removeControl("publishTime");
    }
    if (this.addAlbummForm.valid) {
      // this.nodeList.forEach(i => {
      //   if (i.checkState) {
      //     selectNodes.push(i.nodeCode);
      //   }
      // });
      param =  {
        albumName: this.addAlbummForm.controls["albumName"].value,
        sect: this.addAlbummForm.controls["sect"].value,
        upperCase: this.addAlbummForm.controls["upperCase"].value,
        publishTime: this.preTimeFc,
        albumCategory: this.addAlbummForm.controls["alType"].value,
        resType: this.addAlbummForm.controls["alResType"].value,
        freeFlag: this.addAlbummForm.controls["freeFlag"].value,
        albumDesc: this.addAlbummForm.controls["albumDesc"].value,
        image: this.addAlbummForm.controls["bgUrl"].value,
      };
      if (this.modalData !== "") {
        param.albumCode = this.modalData.albumCode;
      }
      this.albumBusinessService.saveAlbumPost(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整信息!', 2000));
    }
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
