import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { CustomValidators } from '../../shared/custom-validator/custom-validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';

import { ArtInfo} from '../../global-constant';
import {ArtistsDetailComponent} from './artists-detail.component';
import {ArtistsBusinessService} from '../../business-service/artists/artists-business.service';
import {AppService} from '../../app.service';

@Component({
  selector: 'c-artists-derive',
  templateUrl: './artists-derive.component.html',
  styleUrls: ['./artists-derive.component.scss'],
})
export class ArtistsDeriveComponent implements OnInit {

  deriveVideoForm: FormGroup;
  deriveData: any = "";
  modalData: any = "";

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private artistsBusinessService: ArtistsBusinessService,
              private appService: AppService,
              ) {
  }

  ngOnInit() {
    // if ( this.modalData !== "") {
    //   this.getDetail();
    //   this.deriveVideoForm.controls['code'].disable();
    this.getDeriveData ();
  }

  nodeList: Array<any>= [];
  // basicInfos: Array<any>= basicInfo;
  // artAInfos: Array<any>= artAInfo;
  // otherInfos: Array<any>= otherInfo;

  basicInfos: Array<any>= [];
  artInfos: Array<any>= [];
  otherInfos: Array<any>= [];
  ArtInfos: Array<any>= [];
  basicInfoStr: any;
  artInfoStr: any;
  otherInfoStr: any;

  getDeriveData () {
    this.ArtInfos = [];
    ArtInfo.forEach(i => {
      let copyI = Object.assign({}, i);
      this.ArtInfos.push(copyI);
    });
  }
  isAllChecked() {
    this.ArtInfos.every(_ => _.checkState);
  }

  checkAll(ev) {
    this.ArtInfos.forEach(x => x.checkState = ev.target.checked);
  }
  checkArtInfo($event, index) {
    this.ArtInfos[index].checkState = $event.target.checked;
  }
  getparmas() {
    let arr = [];
    this.ArtInfos.forEach(i => {
      if (i.checkState ) {
        arr.push(i.type);
      }
    })
    return arr.toString();
  }

  ok(): void {
    let that = this;
    let param: any;
    let dataparam: any = "";
    dataparam = {
      artistArea:this.deriveData.artistArea,
      artistCode:this.deriveData.artistCode,
      artistName:this.deriveData.artistName,
      artistType:this.deriveData.artistType,
      // beginDate:this.deriveData.beginDate,
      // endDate:this.deriveData.endDate,
      // cpId:this.deriveData.cpId,
    }
    param =  {
        search: dataparam,
        exportField: this.getparmas(),
    };
    param={jsonParam:JSON.stringify(param)};
    this.artistsBusinessService.artistsExcel(param, function(data){
      const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
      that.toastService.toast(toastCfg);
      window.open("/cms"+ data.data.path);
    });

  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
