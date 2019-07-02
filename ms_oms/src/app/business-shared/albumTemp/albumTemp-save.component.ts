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
  }
  opFlag: any;
  AlbumTempData: any= '';
  startFlag: any = [{type: 0, name: '未启用'}, {type: 1, name: '已启用'}];
  articleType: any = [{type: 1, name: '行业资讯'}, {type: 2, name: '公司动态'}];
  article: Array<any>= [articleType[0]];
  start: Array<any>= [startFlag[0]];
  ngOnInit() {
  }

  /**
   * 上传
   */
  ok(): void {
    this.activeModal.close(this.AlbumTempData);
  }

  /**
   * 关闭
   */
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
  changeOpFlag () {
    if (this.AlbumTempData !== '' ) {
      this.opFlag = 2;
    } else {
      this.opFlag = 1;
    }
    return this.opFlag;
  }
}
