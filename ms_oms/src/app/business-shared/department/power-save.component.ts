import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { ZtreeComponent } from '../../shared/ztree/ztree.component';
// import { CustomScrollbarDirective } from '../../shared/custom-scrollbar/custom-scrollbar.directive';

import { DepartmentBusinessService } from '../../business-service/department/department-business.service';

@Component({
  selector: 'c-power-save',
  templateUrl: './power-save.component.html',
  styleUrls: ['./power-save.component.scss']
})
export class PowerSaveComponent implements OnInit, OnDestroy {
  @ViewChild('ztreeInstance') ztreeInstance: ZtreeComponent;

  postId: any;
  type: String;
  setting: any;
  settingData: any;
  nodes: any = [];
  MenusDataList: any;
  DatasDataList: any;
  areasDataList: any;
  projectsDataList: Array<any>= [];
  projectsChecked: Array<any>= [];
  productsDataList: Array<any>= [];
  productsChecked: Array<any>= [];
  hasDataObj: Boolean = true;

  constructor(public activeModal: NgbActiveModal,
              public departmentBusinessService: DepartmentBusinessService,
              private toastService: ToastService) {
  }

  ngOnDestroy() {
    // this.scrollbarInstance.getScrollbarInstance().mCustomScrollbar("destroy");
  }

  ngOnInit() {
    this.setting = {
      check: {
        enable: true
      },
      view: {
        showLine: true,
        showIcon: false
      }
    }
    // this.settingData = {
    //   check: {
    //     enable: true
    //   },
    //   view: {
    //     showLine: true,
    //     showIcon: false
    //   }
    // }

    let that = this;

    if (this.type === "menu") {
      this.getMenuList();
    } else if (this.type === "data") {
      // this.setting.check.chkboxType = { "Y": "s", "N": "ps" };
      that.getDataList();
    }
  }

  /*2018-06-26 wuhua for 权限设置 start*/
  CleanParam (obj) {
    let that = this;
    let result = {};
    let hash ={ // 需要保留的参数
      itemCOde     : true,
      nodeCode     : true,
      name         : true,
      children     : true,
      provinceCode : true,
      productCode  : true,
      postId       : true,
      tId          : true,
      parentTId    : true
    }

    for (let i in obj) {
      if (hash[i]) {
        result[i] = obj[i];
      }
    }

    result = obj
    return result;
  }

  FormatData (arr) { //获取数据结构
    let that = this;
    let result = [];
    let nodeCode = {};
    let itemCode = {};
    let provinceCode = {};
    let productCode = {};
    arr.forEach((item, index) => {
      let o = that.CleanParam(item);
      if (item.children) {
        item.children = [];
      }
      if (item.itemCode) {
        itemCode[item.tId] = o;
      }else if (item.provinceCode) {
        if (provinceCode[item.tId]) {
          provinceCode[item.tId].push(o);
        }else {
          provinceCode[item.tId] = [];
          provinceCode[item.tId].push(o);
        }
      }else if (item.productCode) {
        if (productCode[item.parentTId]) {
          productCode[item.parentTId].push(o);
        }else {
          productCode[item.parentTId] = [];
          productCode[item.parentTId].push(o);
        }
      }
    });

    for (let i in productCode) {
      provinceCode[i].forEach((item, index) => {
        if(item.tId == i) {
          item.children = productCode[i];
        }
      });
    }

    for (let i in provinceCode) {
      for (let k in itemCode) {
        if (provinceCode[i][0].parentTId == itemCode[k].tId) {
          itemCode[k].children.push(provinceCode[i][0]);
        }
      }
    }

    for (let i in itemCode) {
      result.push(itemCode[i]);
    }

    //console.log(nodeCode);
    //console.log(provinceCode);
    //console.log(productCode);
    //console.log(result);
    return result;
  }
  /*2018-06-26 wuhua for 权限设置 end*/

  ok(): void {
    let that = this;
    let param: any;
    if (this.type === "menu") {
      param = {postId: this.postId, menus: this.getMenusCheckedIds(), projects:"", products:"", areas:"", type: 2};
      this.departmentBusinessService.saveMenuPower(param, function(data) {
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '菜单权限设置成功！', 2000));
        that.close();
      });
    } else if (this.type === "data") {
      //param = {postId: this.postId, menus:"", projects: this.getCheckedItemIds(this.dataType[3].value), products: this.getCheckedItemIds(this.dataType[2].value), areas: this.getAreasCheckedIds(), type: 1};
      let source = this.ztreeInstance.getTreeInstance().getCheckedNodes(true);
      let result = this.FormatData(source);
      param = {data: JSON.stringify(result), postId: this.postId};
      this.departmentBusinessService.savePower(param, function(data) {
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '数据权限设置成功！', 2000));
        that.close();
      });
    }
  }

  close() {
    this.activeModal.dismiss({ status: 'closed' });
  }

  getPowerInfo() {
    let param = {postId: this.postId};
    let that = this;
    this.departmentBusinessService.getPowerAllInfo(param, function(data) {
      if (that.type === "menu" && data.obj.menus.length > 0) {
        that.ztreeInstance.checkPreNode(data.obj.menus);
      } else if (that.type === "data" && data.obj.length > 0) {
        that.ztreeInstance.checkPreNode_postID(data.obj);
        // that.checkedItemInfo(data.obj.products, data.obj.projects);
      }
    });
  }
  getPower() {
    let param = {postId: this.postId};
    let that = this;
    this.departmentBusinessService.getPowerAll(param, function(data) {
      if (that.type === "menu" && data.obj.menus.length > 0) {
        that.ztreeInstance.checkPreNode(data.obj.menus);
      }
    });
  }

  getDataList() {
    let that = this;
    this.departmentBusinessService.getQueryDataAuth(function(data) {
      that.DatasDataList = data.obj;
      that.ztreeInstance.resetTree(that.DatasDataList);
      that.ztreeInstance.expandTree(false);
      that.getPowerInfo();
    });
    // this.departmentBusinessService.getQueryDataAuth(function(data) {
    //   if (data.obj === null) {
    //     that.hasDataObj = false;
    //   } else {
    //     if (data.obj[0].name === "区域") {
    //       that.areasDataList = data.obj[0];
    //     }
    //     if (data.obj[1].name === "项目") {
    //       that.projectsDataList = data.obj[1].children;
    //     }
    //     if (data.obj[2].name === "产品") {
    //       that.productsDataList = data.obj[2].children;
    //     }
    //     that.ztreeInstance.resetTree(that.areasDataList);
    //     that.ztreeInstance.expandTree(true);
    //     that.getPowerInfo();
    //   }
    // });
  }

  getMenuList() {
    let that = this;
    this.departmentBusinessService.getQueryMenuAuth(function(data) {
      that.MenusDataList = data.obj;
      that.ztreeInstance.resetTree(that.MenusDataList);
      that.ztreeInstance.expandTree(true);
      // that.getPower();
      that.getPower();
    });
  }

  menusCheckedIds: Array<any>= [];
  getMenusCheckedIds() {
    this.menusCheckedIds = [];
    let arr = this.ztreeInstance.getTreeInstance().getCheckedNodes(true);
    arr.forEach(i => {
      if (this.MenusDataList.id != i.id) {
        this.menusCheckedIds.push(i.id);
      }
    });
    return this.menusCheckedIds.toString();
  }

  areasCheckedIds: Array<any>= [];
  getAreasCheckedIds() {
    this.areasCheckedIds = [];
    let arr = this.ztreeInstance.getTreeInstance().getCheckedNodes(true);
    //console.log(arr)
    // arr.forEach(i => {
    //   if (this.areasDataList.id != i.id) {
    //     this.areasCheckedIds.push(i.id);
    //   }
    // });
    return this.areasCheckedIds.toString();
  }

  dataType: any = [
    {name: "菜单", value: 1},
    {name: "地区", value: 2},
    {name: "产品", value: 3},
    {name: "项目", value: 4},
  ]

  checkAll(e, val) {
    if (val === this.dataType[2].value) {
      this.productsDataList.forEach(i => i.checkState = e.target.checked);
    } else if (val === this.dataType[3].value) {
      this.projectsDataList.forEach(i => i.checkState = e.target.checked);
    }
  }

  isAllChecked(val) {
    if (val === this.dataType[2].value && this.productsDataList.length > 0) {
      return this.productsDataList.every(_ => _.checkState);
    } else if (val === this.dataType[3].value && this.productsDataList.length > 0) {
      return this.projectsDataList.every(_ => _.checkState);
    }
  }

  checkSingle(ev, index, val) {
    if (val === this.dataType[2].value) {
      this.productsDataList[index].checkState = ev.target.checked;
    } else if (val === this.dataType[3].value) {
      this.projectsDataList[index].checkState = ev.target.checked;
    }
  }

  getCheckedItemIds(val) {
    let ids = [];
    if (val === this.dataType[2].value) {
      for (let i in this.productsDataList) {
        if (this.productsDataList[i].checkState) {
          ids.push(this.productsDataList[i].id);
        }
      }
    } else if (val === this.dataType[3].value) {
      for (let i in this.projectsDataList) {
        if (this.projectsDataList[i].checkState) {
          ids.push(this.projectsDataList[i].id);
        }
      }
    };
    return ids.toString();
  }

  checkedItemInfo(products, projects) {
    let projectsIds = [];
    projects.forEach(a => projectsIds.push(a.pid.toString()));
    this.projectsDataList.forEach(i => {
      if (projectsIds.indexOf(i.id) != -1) {
        i.checkState = true;
      }
    });
    let productsIds = [];
    products.forEach(a => productsIds.push(a.pid.toString()));
    this.productsDataList.forEach(i => {
      if (productsIds.indexOf(i.id) != -1) {
        i.checkState = true;
      }
    });
  }

}
