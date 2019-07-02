import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import {CommonBusinessService} from '../../../business-service/common/common-business.service';

@Component({
  selector: 'c-course-upload',
  templateUrl: './course-upload.component.html',
  styleUrls: ['./course-upload.component.scss']
})
export class CourseUploadComponent implements OnInit {
  planCode: any;
  fileUrl: any;
  formParam: any = new FormData();
  tip: any;
  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private commonBusinessService: CommonBusinessService,
              private toastService: ToastService) {
  }


  ngOnInit() {
  }

  ok(): void {
    const that = this;
    if ( this.formParam ) {
      this.commonBusinessService.addImportPlanExcel(this.formParam, function(data){
        if (data.success) {
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
          that.toastService.toast(toastCfg);
          that.tip = data.msg;
        }
      });
    }else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    }
  }


  uploadFile(ev) {
    const file = ev.target.files[0];
    if (file) {
      this.fileUrl = file.name;
      if (file.name.indexOf('.xlsx')) {
        this.formParam.append('fileA', file);
        this.formParam.append('planCode', this.planCode);
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


