import {Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/modal/modal.service';
import { AppService } from '../../../app.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageBusinessService } from '../../../business-service/page/page-business.service';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';
import { ToastService } from '../../../shared/toast/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {ElementCheckComponent} from './../../ottoperate/element-check.component';

@Component({
  selector: 'app-page-config-copy',
  templateUrl: './page-config-copy.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class PageConfigCopyComponent implements OnInit, OnDestroy {
  pageConfigSaveForm: FormGroup;
  getAllProjectmyList = [];
  getAllProvinceList = [];  // 下拉省份列表
  modelData: any;
  setVal: any;
  constructor(
    private appService: AppService,
    private pageBusinessService: PageBusinessService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private toastService: ToastService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) {
    const PageNameFC = new FormControl('', Validators.compose([Validators.required,  Validators.minLength(1), Validators.maxLength(32)]));
    const itemTypeFC = new FormControl('', Validators.compose([Validators.required]));
    const itemFC = new FormControl('', Validators.compose([Validators.required]));
    const proinvceFC = new FormControl('', Validators.compose([Validators.required]));
    const productPageConfigInfoFC = new FormControl({}, Validators.compose([Validators.required]));
    const productPageIdNewFC = new FormControl('', Validators.compose([Validators.required]));

    this.pageConfigSaveForm = this.formBuilder.group({
      PageName: PageNameFC,
      itemType: itemTypeFC,
      item: itemFC,
      proinvce: proinvceFC,
      productPageIdNew: productPageIdNewFC
    });
  }
  ngOnInit() {
    this.setVal = this.modelData;
    this.init();
  }
  init() {
    const that = this;
    const params = {productPageId: this.modelData.productPageId};
    this.pageBusinessService.copyDetialPage(params, function(data){
      if (data.success) {
        that.pageConfigSaveForm.get(['PageName']).setValue(data.obj.productPageName) ;
        that.pageConfigSaveForm.get(['productPageIdNew']).setValue(data.obj.productPageId);
        that.getAllProject();
        that.getAllProvince();
      }
    });
  }

  getAllProject() {
    const that = this;
    const param = {itemType: this.pageConfigSaveForm.controls['itemType'].value };
    this.pageBusinessService.getAllProject(param, function(data){
      if (data.success) {
        that.getAllProjectmyList = [];
        data.obj.forEach( i => {
          that.getAllProjectmyList.push({id: i.sProjectCode, name: i.sProject});
        });
      }
    });
  }
  getAllProvince() {
    const that = this;
    this.pageBusinessService.getProvinces({}, function(data){
      if (data.success) {
        that.getAllProvinceList = [];
        if (data.obj != null) {
          data.obj.forEach( i => {
            that.getAllProvinceList.push({id: i.sAreaCode, name: i.sAreaName});
          });
        }
      }
    });
  }
  getItemList(child) {
    this.pageConfigSaveForm.get(['item']).setValue(child.toString());
  }
  getProvinceList(child) { // 获取省份id
    this.pageConfigSaveForm.get(['proinvce']).setValue(child.toString());
  }
  ok() {
    const that = this;
    this.setVal.itemCode = this.pageConfigSaveForm.get('item').value;
    this.setVal.itemType = this.pageConfigSaveForm.get('itemType').value;
    this.setVal.provinceCode = this.pageConfigSaveForm.get('proinvce').value;
    this.setVal.productPageName = this.pageConfigSaveForm.get('PageName').value;
    this.setVal.versionNum = '';
    if (this.pageConfigSaveForm.valid) {
      const params = {
        productPageIdNew: this.pageConfigSaveForm.get('productPageIdNew').value,
        productPageConfigInfo: JSON.stringify(this.setVal)
      };
      this.pageBusinessService.copyConfigPage(params, function(data){
        if (data.success) {
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '复制成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        }
      });
    } else {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请将信息填写完整!', 2000);
      that.toastService.toast(toastCfg);
    }
  }
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  ngOnDestroy() {
  }
}
