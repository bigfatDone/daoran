import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {articleType, startFlag, terminalType} from '../../global-constant';
import {AlbumTempBusinessService} from '../../business-service/albumTemp/albumTemp-business.service';

@Component({
  selector: 'c-albumTemp-save',
  templateUrl: './albumTemp-save.component.html'
})
export class AlbumTempSaveComponent implements OnInit {

  // saveAlbumTempForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private albumTempBusinessService: AlbumTempBusinessService,
  ) {
    const titleNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const sortNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(2)]));
    const stateNameFc = new FormControl('', Validators.compose([Validators.required]));
    const typeNameFc = new FormControl('', Validators.compose([Validators.required]));
    const contentNameFc = new FormControl('', Validators.compose([Validators.required]));
    // const templateFc = new FormControl('', Validators.compose([Validators.required]));
    // this.saveAlbumTempForm = this.formBuilder.group({
    //   titleName: titleNameFc,
    //   sortName: sortNameFc,
    //   typeName: typeNameFc,
    //   stateName: stateNameFc,
    //   contentName: contentNameFc,
    // });
  }
  opFlag: any;
  AlbumTempData: any= '';
  startFlag: any = [{type: 0, name: '未启用'}, {type: 1, name: '已启用'}];
  articleType: any = [{type: 1, name: '行业资讯'}, {type: 2, name: '公司动态'}];
  article: Array<any>= [articleType[0]];
  start: Array<any>= [startFlag[0]];
  ngOnInit() {
    console.log(this.AlbumTempData)
    if ( this.AlbumTempData !== '') {
      // this.saveAlbumTempForm.patchValue({
      //   titleName: this.articleData.title,
      //   typeName: this.articleData.type,
      //   sortName: this.articleData.sort,
      //   contentName: this.articleData.content,
      // });
    }else {
      // this.saveAlbumTempForm.patchValue({
      //   typeName: this.article[0].type,
      //   stateName: this.start[0].type,
      // });
    }
  }

  /**
   * 上传
   */
  ok(): void {
    let that = this;
    let param: any;
    this.activeModal.close(this.AlbumTempData);
    // if (this.saveAlbumTempForm.getRawValue().stateName === "") {
    //   this.saveAlbumTempForm.removeControl('stateName');
    // }
    // if (this.saveAlbumTempForm.valid) {
    //   param = {
    //     title: this.saveAlbumTempForm.getRawValue().titleName,
    //     content: this.saveAlbumTempForm.getRawValue().contentName,
    //     type: this.saveAlbumTempForm.getRawValue().typeName,
    //     sort: this.saveAlbumTempForm.getRawValue().sortName,
    //     state: this.saveAlbumTempForm.getRawValue().stateName,
    //     op : this.changeOpFlag(),
    //   };
    //   if (that.articleData !== "") {
    //     param.id = that.articleData.id;
    //   }
    //   if (that.articleData !== "") {
    //     param.state = that.articleData.state;
    //   }
    //   this.albumTempBusinessService.saveAlbumTemp(param, function(data){
    //     const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
    //     that.toastService.toast(toastCfg);
    //     that.close();
    //   });
    // } else {
    //   that.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请填写完整信息!', 2000));
    // }
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  changeOpFlag () {
    if (this.AlbumTempData !== "" ) {
      this.opFlag = 2;
    } else {
      this.opFlag = 1;
    }
    return this.opFlag;
  }
}
