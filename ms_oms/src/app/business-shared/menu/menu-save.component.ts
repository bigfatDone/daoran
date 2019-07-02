import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { HttpService } from '../../shared/http/http.service';
import { MenuIcons } from '../../global-constant';
import {createViewChild} from '@angular/compiler/src/core';

import { MenuBusinessService} from '../../business-service/menu/menu-business.service';


declare var $: any;

@Component({
  selector: 'c-menu-save',
  templateUrl: './menu-save.component.html',
  styleUrls:["./menu-save.component.scss"]
})
export class MenuSaveComponent implements OnInit {

  modalData: any;
  modalType: any;

  saveMenuForm: FormGroup;
  typeRadio: any;
  menuIcons: any = MenuIcons;

  selectedIconClass: any;

  menuType: any = [
    {name: "菜单树", value: 0},
    {name: "功能按钮", value: 1}
  ]

  distributLevels: any = [
    {name: "系统管理员", value: 2},
    {name: "超级管理员", value: 1},
    {name: "不可分配", value: 3}
  ]

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private toastService: ToastService, private httpService: HttpService, private menuBusinessService: MenuBusinessService) {
    const nameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)]));
    const urlFc = new FormControl('', Validators.compose([Validators.required]));
    const typeRadioFc = new FormControl(this.menuType[0].value, Validators.compose([Validators.required]));
    const distributRadioFc = new FormControl(this.distributLevels[0].value, Validators.compose([Validators.required]));
    const orderFc = new FormControl(1, Validators.compose([Validators.required]));

    this.saveMenuForm = this.formBuilder.group({
      name: nameFc,
      url: urlFc,
      typeRadio: typeRadioFc,
      order: orderFc,
      distributRadio: distributRadioFc
    });
  }

  ngOnInit() {
    if (this.modalType === "edit") {
      let val = {
        name: this.modalData.name,
        url: this.modalData.functionUrl,
        typeRadio: this.modalData.functionType,
        distributRadio: this.modalData.distributLevel,
        order: this.modalData.functionOrder
      };
      if (!this.modalData.functionOrder) {
        val.order = this.modalData.children.length + 1
      }
      this.saveMenuForm.patchValue(val);
      this.selectedIconClass = this.modalData.iconId;
    } else {
      this.saveMenuForm.patchValue({
        order: this.modalData.children.length + 1
      });
    }
  }

  selectIcons(iconClass) {
    this.selectedIconClass = iconClass;
  }

  ok(): void {
    if (this.saveMenuForm.getRawValue().typeRadio === this.menuType[0].value) {
      this.saveMenuForm.removeControl('url');
    }
    if (this.saveMenuForm.valid) {
      let pagram: any;
      let that = this;
      pagram = {
        functionName: this.saveMenuForm.controls['name'].value,
        functionType: this.saveMenuForm.controls['typeRadio'].value,
        distributLevel: this.saveMenuForm.controls['distributRadio'].value,
        functionOrder: this.saveMenuForm.controls['order'].value,
        iconId: this.selectedIconClass,
      };
      if (this.saveMenuForm.getRawValue().typeRadio != this.menuType[0].value) {
        pagram.functionUrl = this.saveMenuForm.controls['url'].value;
      }
      if (this.modalType === "edit") {
        pagram.id = this.modalData.id;
        this.menuBusinessService.editMenu(pagram, function(data){
          that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '菜单修改成功！', 2000));
          that.close();
        });
      } else {
        pagram.parentId = this.modalData.id;
        this.menuBusinessService.saveMenu(pagram, function(data){
          that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '菜单新增成功！', 2000));
          that.close();
        });
      }
    }
  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
