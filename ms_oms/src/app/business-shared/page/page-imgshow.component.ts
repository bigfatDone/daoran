import {Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalService } from '../../shared/modal/modal.service';
import { AppService } from '../../app.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'c-page-imgshow',
  templateUrl: './page-imgshow.component.html',
  styleUrls: ['./page-imgshow.component.scss']
})
export class PageImgshowComponent implements OnInit, OnDestroy {
  // imgApi: String = "http://192.168.1.202:80/";
  oData:any;
  isAddHttp: Boolean = true;
  imgUrl: String = '';
  constructor(
    private appService: AppService,
    public activeModal: NgbActiveModal,
  ) {
    // this.appService.titleEventEmitter.emit("模板图片");
  }
  ngOnInit() {
    if (this.oData.template) {
      // if (this.isAddHttp) {
        this.imgUrl = environment.imgApi + this.oData.template;
      // } else {
      //   this.imgUrl = this.oData.template;
      // }
    } else {
      this.imgUrl = '';
    }
    // console.log(this.imgUrl);
  }
  ngOnDestroy() {

  }
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
