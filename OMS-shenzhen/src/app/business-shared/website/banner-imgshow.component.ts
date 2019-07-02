import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { AppService } from '../../app.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../business-service/page/page-business.service';
import { pageGenre } from '../../global-constant';
import { environment } from '../../../environments/environment';
// import {ElementSaveComponent} from './element-save.component';
// import {ToastConfig, ToastType} from '../../shared/toast/toast-model';

@Component({
  selector: 'c-page-imgshow',
  templateUrl: './banner-imgshow.component.html',
  styleUrls: ['./banner-imgshow.component.scss']
})
export class BannerImgshowComponent implements OnInit, OnDestroy {
  // imgApi: String = "http://192.168.1.202:80/";
  oData:any;
  imgUrl: String = '';
  constructor(
    private appService: AppService,
    public activeModal: NgbActiveModal,
  ) {
    // this.appService.titleEventEmitter.emit("模板图片");
  }
  ngOnInit() {
    // console.log(environment.imgApi)
    // console.log(this.oData)
    if (this.oData.path) {
      this.imgUrl = environment.imgApi + this.oData.path;
    } else {
      this.imgUrl = '';
    }
  }
  ngOnDestroy() {

  }
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
