import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
// import { pageEleTypeModal, pageResType } from '../../global-constant';
import {JumpBusinessService} from '../../business-service/jump/jump-business.service';

@Component({
  selector: 'c-operating-accessid-check',
  templateUrl: './operating-accessid-check.component.html'
})
export class operatingAccessidCheckComponent implements OnInit {

  dataList: Array<any>= [];

  modalType: any;
  checkAllBox: Boolean = false;

  selectArr: Array<any> = [];
  selectObj: any;

  // pageEleTypeModal: any = pageEleTypeModal;

  options: any = {
    rows: 15,
    page: 1,     // 当前页
    pageCount: 0, // 页码数量
  };

  constructor(public activeModal: NgbActiveModal,
              private toastService: ToastService,
              private jumpBusinessService: JumpBusinessService
  ) {
  }

  // pageEleTypes: Array<any>=pageEleTypeModal;
  // pageResTypes: Array<any>=pageResType;
  ngOnInit() {
    this.getPageList();
    this.getProjects();
    this.getProducts();
    this.getProvinces();
    this.getSlevel1();
    // this.selectObj.elementId = '';
  }

  search() {
    this.options.page = 1;
    this.getPageList();
  }

  selectChange (code) {
  }

  onPageChanged($event) {
    this.options.page = $event;
    this.getPageList();
  }

  projectsList: Array<any> = [];
  pProject: String = '';
  getProjects() {
    let that = this;
    this.jumpBusinessService.projectAuth({}, function(data){
      if (data.length > 0) {
        that.projectsList = data;
      } else {
        that.projectsList = [];
      }
    });
  }

  productList: Array<any> = [];
  pProduct: String = '';
  getProducts() {
    let that = this;
    this.jumpBusinessService.projectProvinceProduct({}, function(data){
      if (data.length > 0) {
        that.productList = data;
      } else {
        that.productList = [];
      }
    });
  }

  provincesList: Array<any> = [];
  pProvinces: String = '';
  getProvinces() {
    let that = this;
    this.jumpBusinessService.projectProvince({}, function(data){
      if (data.length > 0) {
        that.provincesList = data;
      } else {
        that.provincesList = [];
      }
    });
  }

  slevel1List: Array<any> = []; // 分类
  pSlevel1: String = '';
  getSlevel1() {
    let that = this;
    this.jumpBusinessService.getSlevel1Service({}, function(data){
      // console.log(data)
      if (data.length > 0) {
        that.slevel1List = data;
      } else {
        that.slevel1List = [];
      }
    });
  }

  entryName: String = '';
  productVerList: Array<any> = [{name: '高清', ver: 'H'},{name: '标清', ver: 'S'},{name: '安卓', ver: 'A'}];
  pProductVer: String = '';
  initNum: Number = 0;
  getPageList() {
    let that = this;
    let param = {
      page: this.options.page,
      rows: this.options.rows,
      sProjectCode: this.pProject,
      sProductCode: this.pProduct,
      sProductVer: this.pProductVer,
      provinceCode: this.pProvinces,
      sLevel1: this.pSlevel1,
      sEntryName: this.entryName,
    };
    // param.sProjectCode = '0' + param.sProjectCode;
    this.jumpBusinessService.getEntermanageListService(param, function(data){
      // console.log(123)
      // console.log(data)
      if (data.data.length > 0) {
        that.dataList = data.data;
        that.options.page = that.options.page;
        that.options.total = data.total;
        that.options.pageCount = Math.ceil(data.total / that.options.rows) * that.options.rows;
        that.initNum = (that.options.page - 1) * that.options.rows;
      } else {
        that.dataList = [];
      }
    });
  }
  clear () {
    this.options.page = 1;
    this.pProject = '';
    this.pProduct = '';
    this.pProductVer = '';
    this.pProvinces = '';
    this.pSlevel1 = '';
    this.entryName = '';
    this.getPageList();
  }

  checkAll(ev) {
    // this.selectArr = [];
    // this.dataList.forEach(x => x.checked = ev.target.checked);
    this.dataList.forEach((el, el_index) => {
      el.checkState = ev.target.checked;
      if (ev.target.checked) {
        this.selectArr.push(this.dataList[el_index]);
      }
    });
    // this.selectArr = this.dataList;
    // this.selectId = this.selectId.slice(0, this.selectId.length - 1);
  }

  isAllChecked() {
    if ( this.dataList.length > 0) {
      return this.dataList.every(_ => _.checkState);
    }
  }

  checkTr(index) {
    if (this.checkAllBox) {
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
    } else if ( !this.checkAllBox ) {
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
      this.selectObj = this.dataList[index].checkState ? this.dataList[index] : '';
    }
  }

  checkSingle(ev, index) {
    if (!this.checkAllBox) { // 非全选页
      if (ev.target.checked === false) {
        return;
      }
      this.dataList.forEach((el, el_index) => {
        if (el_index !== index) {
          el.checkState = !this.dataList[index].checkState;
        }
      });
      this.selectObj = this.dataList[index].checkState ? this.dataList[index] : '';
    } else if (this.checkAllBox) { // 可全选
      this.dataList[index].checkState = ev.target.checked;
      this.selectArr = [];
      this.dataList.forEach((el, el_index) => {
        // this.selectObj += this.dataList[el_index].checked ? this.dataList[el_index].pageId + ',' : '';
        if (this.dataList[el_index].checkState) {
          this.selectArr.push(this.dataList[el_index]);
        }
      });
      // this.selectObj = this.selectObj.slice(0, this.selectObj.length - 1);
    }
  }

  isEmptyObject (obj) {
    for (let key in obj){
      return false; // 返回false，不为空对象
    }
    return true; // 返回true，为空对象
  }

  ok(): void {
    if (this.checkAllBox === false) {
      if (!this.isEmptyObject(this.selectObj)) {
        this.activeModal.close(this.selectObj);
      } else {
        this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择一项!', 2000));
      }
    } else {
      this.dataList.forEach(i => {
        if (i.checkState) {
          this.selectArr.push(i);
        }
      })
      if (this.selectArr.length > 0) {
        this.activeModal.close(this.selectArr);
      } else {
        this.toastService.toast(new ToastConfig(ToastType.ERROR, '', '请选择一项!', 2000));
      }
    }

  }

  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
