import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { EntryBusinessService } from '../../business-service/entry/entry-business.service';

@Component({
  selector: 'c-visit-details',
  templateUrl: './visit-details.component.html'
})
export class VisitDetailsComponent implements OnInit {

  iId: String = '';

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private entryBusinessService: EntryBusinessService,
  ) {
  }

  detailData: any = {};
  getDetail () {
    let that = this;
    let param = {
      iId: that.iId
    };
    that.entryBusinessService.getEnterManageInfoService(param, function(data){
      that.detailData = data;
    });
  }
  ngOnInit() {
    this.getDetail();
  }

  /**
   * 上传
   */
  ok(): void {

  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
