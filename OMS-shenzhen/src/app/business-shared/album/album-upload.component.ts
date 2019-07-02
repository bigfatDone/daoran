import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {FormGroup} from '@angular/forms';
import {AlbumBusinessService} from '../../business-service/album/album-business.service';

@Component({
  selector: 'c-album-upload',
  templateUrl: './album-upload.component.html',
  styleUrls: ['./album-upload.component.scss']
})
export class AlbumUploadComponent implements OnInit {
  uploadData: any = '';

  constructor(public activeModal: NgbActiveModal,
              private ngbModalService: NgbModal,
              private commonBusinessService: CommonBusinessService,
              private albumBusinessService: AlbumBusinessService,
              private toastService: ToastService) {
  }


  ngOnInit() {
  }

  excelIds: Array<any> = [];
  ok(): void {
    let that = this;
    if ( this.formParam ) {
      if (this.uploadData.type === 'album'){
        this.albumBusinessService.uploadAlbumExcel(this.formParam, function(data){
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
        this.albumBusinessService.uploadArtistExcel(this.formParam, function(data){
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
      }
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
        // if (this.uploadData.type === 'album'){
          this.formParam.append("albumCode", this.uploadData.id);
          this.formParam.append("resType", this.uploadData.resType);
        // } else {
        //   this.formParam.append("albumCode", this.uploadData.id);
        // }
        // this.formParam.append("resType", this.uploadData.resType);
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


