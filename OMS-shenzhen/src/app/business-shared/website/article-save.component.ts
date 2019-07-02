import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import {WebsiteBusinessService} from '../../business-service/website/website-business.service';
import {articleType, startFlag, terminalType} from '../../global-constant';

@Component({
  selector: 'c-article-save',
  templateUrl: './article-save.component.html'
})
export class ArticleSaveComponent implements OnInit {

  saveArticleForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private websiteBusinessService: WebsiteBusinessService,
  ) {
    const titleNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(32)]));
    const sortNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(2)]));
    const stateNameFc = new FormControl('', Validators.compose([Validators.required]));
    const typeNameFc = new FormControl('', Validators.compose([Validators.required]));
    const contentNameFc = new FormControl('', Validators.compose([Validators.required]));
    // const templateFc = new FormControl('', Validators.compose([Validators.required]));
    this.saveArticleForm = this.formBuilder.group({
      titleName: titleNameFc,
      sortName: sortNameFc,
      typeName: typeNameFc,
      stateName: stateNameFc,
      contentName: contentNameFc,
    });
  }
  opFlag: any;
  articleData: any= '';
  startFlag: any = [{type: 0, name: '未启用'}, {type: 1, name: '已启用'}];
  articleType: any = [{type: 1, name: '行业资讯'}, {type: 2, name: '公司动态'}];
  article: Array<any>= [articleType[0]];
  start: Array<any>= [startFlag[0]];
  ngOnInit() {
    if ( this.articleData !== '') {
      this.saveArticleForm.patchValue({
        titleName: this.articleData.title,
        typeName: this.articleData.type,
        sortName: this.articleData.sort,
        contentName: this.articleData.content,
      });
    }else {
      this.saveArticleForm.patchValue({
        typeName: this.article[0].type,
        stateName: this.start[0].type,
      });
    }
  }

  /**
   * 上传
   */
  ok(): void {
    let that = this;
    let param: any;
    if (this.saveArticleForm.getRawValue().stateName === "") {
      this.saveArticleForm.removeControl('stateName');
    }
    if (this.saveArticleForm.valid) {
      param = {
        title: this.saveArticleForm.getRawValue().titleName,
        content: this.saveArticleForm.getRawValue().contentName,
        type: this.saveArticleForm.getRawValue().typeName,
        sort: this.saveArticleForm.getRawValue().sortName,
        state: this.saveArticleForm.getRawValue().stateName,
        op : this.changeOpFlag(),
      };
      if (that.articleData !== "") {
        param.id = that.articleData.id;
      }
      if (that.articleData !== "") {
        param.state = that.articleData.state;
      }
      this.websiteBusinessService.addArticleePost(param, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '保存成功!', 2000);
        that.toastService.toast(toastCfg);
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
  changeOpFlag () {
    if (this.articleData !== "" ) {
      this.opFlag = 2;
    } else {
      this.opFlag = 1;
    }
    return this.opFlag;
  }
}
