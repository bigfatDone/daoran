import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {FormGroup} from '@angular/forms';
import {OrderBusinessService} from '../../business-service/order/order-business.service';

@Component({
  selector: 'c-once-upload',
  templateUrl: './once-upload.component.html',
  styleUrls: ['./once-upload.component.scss']
})
export class  OnceUploadComponent implements OnInit {
  modalData: any = '';

  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private orderBusinessService: OrderBusinessService,
              private toastService: ToastService) {
  }


  ngOnInit() {
  }

  excelIds: Array<any> = [];
  ok(): void {
    let that = this;
    if ( this.formParam ) {
      this.orderBusinessService.uploadFiles(this.formParam, function(data){
        // data.obj.forEach( i => {
        //   that.excelIds.push(i.resCode);
        // })
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
          that.toastService.toast(toastCfg);
          that.close();
        // that.activeModal.close(data.obj);
        });
    }else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  fileUrl: any;

  formParam: any = new FormData();

  uploadFile(ev) {
    let file = ev.target.files[0];
    this.formParam.delete('styleCode');
    this.formParam.delete('files');
    if (file) {
      this.fileUrl = file.name;
      // if(file.name.indexOf(".xlsx")){
      this.formParam.append("files", file);
      this.formParam.append("styleCode", this.modalData.styleCode);
      // }else {
      //   this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '导入数据格式必须是xls格式文件!', 2000));
      // }
    }
  }
  // opFlag: any;
  // bannerData: any = "";
  // bgServiceUrl: any="";
  // onceUpload(ev) {
  //   console.log(ev)
  //   let file = ev.target.files[0];
  //   if (file) {
  //     let param = new FormData();
  //     let that = this;
  //     param.append("files", file);
  //     param.append("styleCode", this.modalData.styleCode);
  //     this.orderBusinessService.uploadFiles(param, function(data){
  //       console.log(data)
  //       // that.addBannerForm.patchValue({"bgUrl": data});
  //       // that.bgServiceUrl = environment.imgApi + data;
  //     });
  //   }
  // }


  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}


