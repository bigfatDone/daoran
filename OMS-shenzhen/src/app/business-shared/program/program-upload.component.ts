import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'c-program-upload',
  templateUrl: './program-upload.component.html',
  styleUrls: ['./program-upload.component.scss']
})
export class ProgramUploadComponent implements OnInit {
  uploadData: any = '';

  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private commonBusinessService: CommonBusinessService,
              private toastService: ToastService) {
  }


  ngOnInit() {
  }

  excelIds: Array<any> = [];
  ok(): void {
    let that = this;
    if ( this.formParam ) {
      this.commonBusinessService.uploadExcelPost(this.formParam, function(data){
        if (data.obj.length > 0) {
          data.obj.forEach( i => {
            that.excelIds.push(i.resCode);
          })
        }
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
          that.toastService.toast(toastCfg);
          // that.close();
        that.activeModal.close(data.obj);
        });
    }else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }

  fileUrl: any;

  formParam: any = new FormData();
  uploadFile(ev) {
    let file = ev.target.files[0];
    if (file) {
      this.fileUrl = file.name;
      if(file.name.indexOf(".xlsx")){
        this.formParam.append("infoFile", file);
        this.formParam.append("listCode", this.uploadData.listCode);
        this.formParam.append("resType", this.uploadData.resType);
      }else {
        this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '导入数据格式必须是xls格式文件!', 2000));
      }
    }
  }


  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}


