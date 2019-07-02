import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {OrderBusinessService} from '../../business-service/order/order-business.service';
// import { CustomValidators } from '../../shared/custom-validator/custom-validator';
// import { environment } from '../../../environments/environment.prod';
import { environment } from '../../../environments/environment';


@Component({
    selector: 'c-picture-save',
    templateUrl: './picture-save.component.html',
    styleUrls: ['./picture-save.component.scss']
})

export class PictureSaveComponent implements OnInit {
    savePicture: FormGroup;
    modalData: any;

    constructor(public activeModal: NgbActiveModal,
        private toastService: ToastService,
        private formBuilder: FormBuilder,
        private orderBusinessService: OrderBusinessService,
    ) {
      const nameFc = new FormControl('', Validators.compose([Validators.required]));
      const templateFc = new FormControl('', Validators.compose([Validators.required]));
      const desFc = new FormControl('', Validators.compose([]));
      // const typeNameFc = new FormControl('', Validators.compose([Validators.required]));
      // const bgUrlFc = new FormControl('', Validators.compose([Validators.required]));
      // const templateFc = new FormControl('', Validators.compose([Validators.required]));
      this.savePicture = this.formBuilder.group({
        name: nameFc,
        template: templateFc,
        des: desFc,
      });
    }

    oneImgSrcA: any = "";
    oneImgSrcA1: any = "";
    oneInputFileA: any = "";
    oneInputFileA1: any = "";
    oneConfirmAdes: any = "";

    imgApi: any;

    // modalData: any;

    newFile: any = new FormData();

    ngOnInit() {
       this.imgApi = environment.imgApi;
        // console.log(this.modalData);
        this.getTemplate();
        if (this.modalData !== "") {
          this.savePicture.patchValue({
            name: this.modalData.styleName,
            template: this.modalData.template,
            des: this.modalData.styleDesc,
          });
        }
    }

    sTemplate: any= [];
    getTemplate() {
    let that = this;
    this.orderBusinessService.getDiyOrderTemplateList(function(data){
      if (data.length > 0) {
        that.sTemplate = data;
      } else {
        that.sTemplate = [];
      }
    });
  }


    /**
     * @description 上传
     */

    ok(): void {
        let param: any;
        let that = this;

      if (this.savePicture.valid) {
        param = {
          styleName: this.savePicture.getRawValue().name,
          template: this.savePicture.getRawValue().template,
          styleDesc: this.savePicture.getRawValue().des,
        };
        if (this.modalData !== "") {
          param.styleCode = this.modalData.styleCode;
        }

        this.orderBusinessService.templateImgSave(param, function(data){
          const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
          that.toastService.toast(toastCfg);
          that.close();
        });
      } else {
        that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请将信息填写完整!', 2000));
      }
    }

    /**
     * @description 关闭
     *
     */

    close(): void {
        this.activeModal.dismiss({ status: 'closed'});
    }
}
