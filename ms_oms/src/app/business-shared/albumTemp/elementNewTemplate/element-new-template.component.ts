import {Component, OnInit, OnDestroy} from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ElementNewTemplateSave} from './elementNewTemplateSave.component';
import {environment} from '../../../../environments/environment';
import { PageBusinessService } from '../../../business-service/page/page-business.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../../shared/toast/toast-model';

@Component({
  selector: 'c-element-new-template',
  templateUrl: './element-new-template.component.html',
  styleUrls: ['./element-new-template.component.scss'],
})
export class ElementNewTemplateComponent implements OnInit, OnDestroy {
  navArr = [{text: '模块元素', className: 'act'}, {text: '模块样式', className: ''}, {text: '模块属性', className: ''}, {text: '高级配置', className: ''}];
  isShow = 0;
  boxActClass = 0;
  showThisEleModal: any = '';
  ElementSaveData: any;
  elementList = []; // 元素数组
  imgApi = '';
  saveEleForm = {
    pageId: '',
    id: '',
    specialModuleName: '',
    moduleStyle: 0,
    specialElementVos: '',
    xAxisDistance: 0,
    yAxisDistance: 0,
    keyUp: '',
    keyDown: '',
    keyLeft: '',
    keyRight: '',
    showNum: 6,
    defaultSpace: 10,
    moduleSort: 0,
    smallVideo: 'yes'
  };
  newFile: any = new FormData();
  imgSrcA = '';
  randoms: any;
  constructor(
    public activeModal: NgbActiveModal,
    private ngbModalService: NgbModal,
    private pageBusinessService: PageBusinessService,
    private toastService: ToastService,
  ) {}
  ngOnInit() {
    const that = this;
    this.imgApi = environment.imgApi;
    if (this.ElementSaveData.type === 'edit') {
      that.imgApi = this.ElementSaveData.layrecOrextrec;
      that.saveEleForm = {
        pageId: that.ElementSaveData.data.partId,
        id: that.ElementSaveData.data.id,
        specialModuleName: that.ElementSaveData.data.specialModuleName,
        moduleStyle: that.ElementSaveData.data.moduleStyle,
        specialElementVos: '',
        xAxisDistance: that.ElementSaveData.data.xAxisDistance,
        yAxisDistance: that.ElementSaveData.data.yAxisDistance,
        keyUp: that.ElementSaveData.data.keyUp,
        keyDown: that.ElementSaveData.data.keyDown,
        keyLeft: that.ElementSaveData.data.keyLeft,
        keyRight: that.ElementSaveData.data.keyRight,
        showNum: that.ElementSaveData.data.showNum,
        defaultSpace: that.ElementSaveData.data.defaultSpace,
        moduleSort: that.ElementSaveData.data.moduleSort,
        smallVideo: that.ElementSaveData.data.smallVideo
      };
      that.boxActClass = that.ElementSaveData.data.moduleStyle;
      that.newFile.set( 'id', that.ElementSaveData.data.id);
      that.elementList = that.ElementSaveData.data.smeVoList;
      if (this.ElementSaveData.data.changeImg === null || this.ElementSaveData.data.changeImg === 'null') {
        this.imgSrcA = '';
        this.newFile.set( 'changeImg', '');
      } else {
        this.imgSrcA = this.ElementSaveData.layrecOrextrec + this.ElementSaveData.data.changeImg + '?random=' + Math.random();
        this.newFile.set( 'changeImg', this.ElementSaveData.data.changeImg);
      }
    }else {
      this.getSpecialElementSort();
      this.newFile.set( 'id', '');
      this.newFile.set( 'changeImg', '');
      this.saveEleForm.specialModuleName = this.ElementSaveData.data.nextSpeicalElementAlias;
    }
    that.randoms = Math.random();
  }
  ngOnDestroy() {
  }
  navClick(i) {
    this.navArr.forEach((j) => {
      j.className = '';
    });
    this.navArr[i].className = 'act';
    this.isShow = i;
  }
  boxAct(i) {
    this.boxActClass = i;
    this.saveEleForm.moduleStyle = i;
  }
  save(data) {
    const that = this;
    this.showThisEleModal = this.ngbModalService.open(ElementNewTemplateSave, {size: 'lg'});
    this.showThisEleModal.componentInstance.modalData = {
      data: data,
      partId: that.ElementSaveData.partId,
      type: 'edit',
      sort: data.layoutSeq,
      id: that.ElementSaveData.data.id  // 传给子组件的id，从父获取
    };
    this.showThisEleModal.result.then((res) => {
      for (let i = 0; i < that.elementList.length; i++) {
            if (that.elementList[i].elementId === res.obj.elementId) {
              that.elementList.splice(i, 1, res.obj);
            }
      }
      that.randoms = Math.random();
      console.log(that.elementList);
    }, (reason) => {
    });
  }
  newElement() {
    const that = this;
    this.showThisEleModal = this.ngbModalService.open(ElementNewTemplateSave, {size: 'lg'});
    this.showThisEleModal.componentInstance.modalData = {
      data: that.ElementSaveData.data,
      partId: that.ElementSaveData.partId,
      type: 'add',
      sort: that.elementList.length
    };
    this.showThisEleModal.result.then((res) => {
      res.obj.img = that.imgApi + res.obj.imageVa + '?random=' + Math.random();
      that.elementList.push(res.obj);
   //   console.log(that.elementList);
    }, (reason) => {
    });
  }
  up(i) {
    const temp = this.elementList[i - 1];
    const templayoutSeq = this.elementList[i - 1].layoutSeq;
    const templayoutSeq2 = this.elementList[i].layoutSeq;
    this.elementList[i - 1] = this.elementList[i];
    this.elementList[i] = temp;
    this.elementList[i].layoutSeq = templayoutSeq2;
    this.elementList[i - 1].layoutSeq = templayoutSeq;
    console.log(this.elementList);

  }
  down(i) {
    const temp = this.elementList[i + 1];
    const templayoutSeq = this.elementList[i + 1].layoutSeq;
    const templayoutSeq2 = this.elementList[i].layoutSeq;
    this.elementList[i + 1] = this.elementList[i];
    this.elementList[i] = temp;
    this.elementList[i + 1].layoutSeq = templayoutSeq;
    this.elementList[i].layoutSeq = templayoutSeq2;
    console.log(this.elementList);

  }
  del(i, elementId) {
    const that = this;
    if (this.elementList.length === 1) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '至少需要一个模块元素!', 2000);
      this.toastService.toast(toastCfg);
      return;
    }
    this.elementList.splice(i, 1);
    this.elementList.forEach((value, index) => {
      value.layoutSeq = index;
    });
    const param = {elementId: elementId};
    this.pageBusinessService.delSpecialModuleElement(param, function(data){
      const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
      that.toastService.toast(toastCfg);
    });

  }
  ok() {
    console.log(this.elementList);
    if (this.elementList.length <= 0) {
      const toastCfg = new ToastConfig(ToastType.WARNING, '', '请选择模块元素!', 2000);
      this.toastService.toast(toastCfg);
      return;
    }
    const that = this;
    this.newFile.set( 'pageId', this.ElementSaveData.pageId);
    this.newFile.set( 'partId', this.ElementSaveData.partId);
    this.newFile.set( 'specialModuleName', this.saveEleForm.specialModuleName);
    this.newFile.set( 'moduleStyle', this.saveEleForm.moduleStyle);
    this.newFile.set( 'specialElementVos', JSON.stringify(this.elementList));
    this.newFile.set( 'xAxisDistance', this.saveEleForm.xAxisDistance);
    this.newFile.set( 'yAxisDistance', this.saveEleForm.yAxisDistance);
    this.newFile.set( 'keyUp', this.saveEleForm.keyUp);
    this.newFile.set( 'keyDown', this.saveEleForm.keyDown);
    this.newFile.set( 'keyLeft', this.saveEleForm.keyLeft);
    this.newFile.set( 'keyRight', this.saveEleForm.keyRight);
    this.newFile.set( 'showNum', this.saveEleForm.showNum);
    this.newFile.set( 'defaultSpace', this.saveEleForm.defaultSpace);
    this.newFile.set( 'moduleSort', this.saveEleForm.moduleSort);
    this.newFile.set( 'smallVideo', this.saveEleForm.smallVideo);

    this.pageBusinessService.newTemplartElement(this.newFile, function(data){
      const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
      that.toastService.toast(toastCfg);
      that.close();
    });
  }
  imgUp(ev, index) {
    const evAnd = ev.target ? ev.target : ev.srcElement;
    const file = evAnd.files[0];
    this.newFile.set( 'file' + index, file);
    const that = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
      switch (index) {
        case 'A':
          that.imgSrcA = this.result;
          break;
      }
    };
  }
  close() {
    this.activeModal.dismiss({ status: 'closed' });
  }
  getSpecialElementSort() {
    const that = this;
    this.pageBusinessService.getSpecialElementSort({elementId: that.ElementSaveData.partId }, function(data){
      that.saveEleForm.moduleSort = data;
    });
  }
  numbers(num, type) {
    if (num <= 0) {
      num = 0;
    } else {
      num = Math.floor(num);
    }
    switch (type) {
      case 'showNum':
        this.saveEleForm.showNum = num;
        break;
      case 'defaultSpace':
        this.saveEleForm.defaultSpace = num;
        break;
      case 'moduleSort':
        this.saveEleForm.moduleSort = num;
        break;
      default:
    }
  }
}
