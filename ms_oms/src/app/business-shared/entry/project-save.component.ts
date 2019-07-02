import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { EntryBusinessService } from '../../business-service/entry/entry-business.service';

@Component({
  selector: 'c-project-save',
  templateUrl: './project-save.component.html'
})
export class ProjectSaveComponent implements OnInit {

  saveProjectForm: FormGroup;

  modalData: any;

  constructor(public activeModal: NgbActiveModal, private entryBusinessService: EntryBusinessService, private toastService: ToastService, private formBuilder: FormBuilder) {
    const nameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(16)]));
    const codeFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(2)]));
    this.saveProjectForm = this.formBuilder.group({
      name: nameFc,
      code: codeFc,
    });
  }

  ngOnInit() {
    // if (this.modalData !== "") {
      this.saveProjectForm.controls ["code"].disable();
    // }
    this.getAllProduct();
    this.getAllItem();
  }

  getItemCode() {
    this.itemData.forEach( i => {
      if (i.projectName === this.saveProjectForm.controls['name'].value) {
        this.saveProjectForm.patchValue({
          code: i.projectCode,
        });
      }
    })
  }

  itemData: Array<any>= [];
  getAllItem() {
    let that = this;
    this.entryBusinessService.getAllProjectInfoList(function(data){
      if (data.length) {
        that.itemData = data;
      } else {
        that.itemData = [];
      }
      that.getProjectInfo();
    });
  }
  allProduct: Array<any>= [];
  getAllProduct() {
    let that = this;
    this.entryBusinessService.getAllProduct(function(data){
      if (data.length) {
        that.allProduct = data;
      } else {
        that.allProduct = [];
      }
      that.getProjectInfo();
    });
  }

  infoAllProduct (data) {
    let arr = data.split("，");
    this.allProduct.forEach(i => {
      for(let n of arr) {
        if (i.productNameVer === n) {
          i.checkState = true;
          i.disabled = true;
        }
      }
    });
  }

  checkAll($event) {
    this.allProduct.forEach(i => {
      if (!i.disabled) {
        i.checkState = $event.target.checked;
      }
    });
  }

  isAllChecked() {
    if (this.allProduct.length > 0) {
      return this.allProduct.every(_ => _.checkState);
    }
  }

  isAllDisabled() {
    if (this.allProduct.length > 0) {
      return this.allProduct.every(_ => _.disabled);
    }
  }

  checkSingle($event, index) {
    this.allProduct[index].checkState = $event.target.checked;
  }

  projectInfoData : any;
  getProjectInfo() {
    if (this.modalData !== "") {
      let that = this;
      let param = {projectId: this.modalData};
      this.entryBusinessService.getProjectInfo(param, function(data){
        that.projectInfoData = data;
        that.infoAllProduct(data.productStr);
        that.saveProjectForm.patchValue({
          name: data.project,
          code: data.projectCode,
        });
      });
    }
  }

  ok(): void {
    let that = this;
    let param: any = {
      project: this.saveProjectForm.controls["name"].value,
      projectCode: this.saveProjectForm.controls["code"].value
    };
    let ids: Array<any>= [];
    if (this.modalData !== "") {
      this.allProduct.forEach(i => {
        if (i.checkState && !i.disabled) {
          ids.push(i.productVerCode);
        }
      });
      param.selectProducts = ids.toString();
      param.projectId = this.modalData;
      this.entryBusinessService.editProject(param, function(data){
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '修改成功!', 2000));
        that.close();
      });
    } else if (this.saveProjectForm.valid) {
      this.allProduct.forEach(i => {
        if (i.checkState) {
          ids.push(i.productVerCode);
        }
      });
      param.selectProducts = ids.toString();
      this.entryBusinessService.addProject(param, function(data){
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000));
        that.close();
      });
    } else {
      that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整信息!', 2000));
    }
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
