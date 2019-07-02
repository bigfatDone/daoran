import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { GatewayBusinessService } from '../../business-service/gateway/gateway-business.service';

@Component({
  selector: 'c-gateway-save',
  templateUrl: './gateway-save.component.html',
  styleUrls: ['./gateway-save.component.scss']
})
export class GatewaySaveComponent implements OnInit{

  dataList: Array<any>= [];

  constructor(public activeModal: NgbActiveModal,
              public gatewayBusinessService: GatewayBusinessService,
              public toastService: ToastService,
  ) {

  }

  ngOnInit() {
    this.getPointList();
  }

  checkAll(ev) {
    this.dataList.forEach(x => x.checkState = ev.target.checked);
  }

  isAllChecked() {
    if ( this.dataList.length > 0) {
      return this.dataList.every(_ => _.checkState);
    }
  }

  checkSingle(ev, index) {
    this.dataList[index].checkState = ev.target.checked;
  }

  getPointList() {
    let that = this;
    this.gatewayBusinessService.pointListPost(function(data){
      if (data.length > 0) {
        that.dataList = data;
      } else {
        that.dataList = [];
      }
    });
  }

  selectCheck: Array<any>= [];
  ok(): void {
    let that = this;
    this.selectCheck = [];
    this.dataList.forEach(i => { if (i.checkState) { this.selectCheck.push(i.nodeCode); }});
    if (this.selectCheck.length > 0) {
      let param = {nodeCodesStr: this.selectCheck.toString()};
      this.gatewayBusinessService.savePointPost(param, function(data){
        that.close();
      });
    } else {
      this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '至少选中一项!', 2000));
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
