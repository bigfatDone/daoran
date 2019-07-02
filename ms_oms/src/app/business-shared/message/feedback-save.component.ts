import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { MessageBusinessService } from '../../business-service/message/message-business.service';
import { pageEleTypeModal, pageTypeData } from '../../global-constant';

@Component({
  selector: 'c-feedback-save',
  templateUrl: './feedback-save.component.html',
  styleUrls: ['./feedback-save.component.scss']
})
export class FeedbackSaveComponent implements OnInit {

  modelData: any = '';
  dataList: Array<any>= [];
  devPlatformData: Array<any>= [{type:'1', value: 'Linux（EPG）'}, {type:'2', value: 'Android（OTT）'}];
  devPlatform: any = '';
  modalType: any;
  fromProcuctList: Boolean = false;

  selectId: String = "";

  pageEleTypeModal: any = pageEleTypeModal;

  options: any = {
    rows: 20,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private messageBusinessService: MessageBusinessService) {
  }

  pageTypes: Array<any>=pageTypeData;
  pageType: any = "";

  ngOnInit() {
    this.getAllProduct();
    this.getSaveList();
  }

  search() {
    this.options.page = 1;
    this.getSaveList();
  }

  onPageChanged($event) {
    this.options.page = $event;
    this.getSaveList();
  }

  sPageId: any;
  sAlias: any;
  sPageType: any = "";
  initNum: Number = 0;

  productCodes: Array<any> = [];
  productCode: any = '';
  getAllProduct() {
    let that = this;
    this.messageBusinessService.getAllProductAuth(function(data){
      if (data.length > 0) {
        that.productCodes = data;
      } else {
        that.productCodes = [];
      }
    });
  }

  getSaveList() {
    let that = this;
    let param = {
      fbpid: this.modelData.fbpid,
    }
    this.messageBusinessService.feedbackDetial(param, function(data){
      if (data.success) {
        data.obj.devPlatform === null  ? that.devPlatform = ''  : that.devPlatform = data.obj.devPlatform.toString();
        data.obj.projectCode === null  ? that.productCode = ''  : that.productCode = data.obj.projectCode;
        if (data.obj.feedbackDetailList !== null) {
          if (data.obj.feedbackDetailList.length > 0) {
            that.dataList = data.obj.feedbackDetailList;
          } else {
            that.dataList = [];
          }
        } else {
          that.dataList = [];
        }
      }
    });
  }

  clear () {
    let t = this;
    t.options.page = 1;
    t.sPageId = '';
    t.sAlias = '';
    t.sPageType = '';
    t.getSaveList();
  }

  checkAll(ev) {
    this.selectId = '';
    // this.dataList.forEach(x => x.checked = ev.target.checked);
    this.dataList.forEach((el, el_index) => {
      el.checked = ev.target.checked;
      el.checkState = ev.target.checked;
      if (ev.target.checked) {
        this.selectId += (this.dataList[el_index].pageId + ',');
      }
    });
    this.selectId = this.selectId.slice(0, this.selectId.length - 1);
  }

  isAllChecked() {
    if ( this.dataList.length > 0) {
      return this.dataList.every(_ => _.checkState);
    }
  }


  checkTr(index) {
    // if (this.fromProcuctList) {
    //   this.dataList.forEach( (el, ind) => {
    //     if (ind === index) {
    //       if (this.dataList[index].checkState) {
    //         this.dataList[index].checkState = false;
    //       } else {
    //         this.dataList[index].checkState = true;
    //       }
    //     }
    //   });
    // } else if ( !this.fromProcuctList ) {
      this.dataList.forEach( (el, ind) => {
        if (ind === index) {
          if (this.dataList[index].checkState) {
            this.dataList[index].checkState = false;
          } else {
            this.dataList[index].checkState = true;
          }
        } else {
          this.dataList[ind].checkState = false;
        }
      });
    // }
  }
  checkSingle(ev, index) {
    this.dataList.forEach((el, el_index) => {
      if (el_index === index) {
        el.checkState = ev.target.checked;
      } else {
        el.checkState = false;
      }
    });
  }

  chooseData: Array<any> = [];
  ok(): void {
    let that = this;
    let param: any;
    // if (this.addBannerForm.valid) {
      param = {
        devPlatform: this.devPlatform,
        projectCode: this.productCode,
        status: this.modelData.status,
        feedbackDetailList: JSON.stringify(this.dataList),
      };
      if (this.modelData !== "") {
        param.fbpid = this.modelData.fbpid;
      }

      this.messageBusinessService.feedbackEdit(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
        that.close();
      });
    // } else {
    //   that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
    // }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  addRow() {
    let dataLen = this.dataList.length;
    if (dataLen < 12) {
      this.dataList.push({
        problem: "",
      });
    } else {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '最多新增12条', 3000);
      this.toastService.toast(toastCfg);
    }
  }
  del (ind) {
    this.dataList.splice(ind, 1);
  }
  testInput (data) {
    if (data.length > 10 ) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '每个问题限制10个字符以内', 3000);
      this.toastService.toast(toastCfg);
    }
  }
}
