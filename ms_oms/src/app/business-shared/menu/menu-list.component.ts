import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { ModalService } from '../../shared/modal/modal.service';
import { ConfirmConfig, AlertType, AlertConfig } from '../../shared/modal/modal-model';
import { Utils } from '../../shared/util/utils';

import { AppService } from '../../app.service';
import { ZtreeComponent } from '../../shared/ztree/ztree.component';

import { MenuSaveComponent} from './menu-save.component';

import { MenuBusinessService} from '../../business-service/menu/menu-business.service';

declare var $: any;

@Component({
  selector: 'c-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit, OnDestroy {
  @ViewChild('ztreeInstance') ztreeInstance: ZtreeComponent;

  ztreeId: any = "ztreeId";

  nodes: any = [];

  constructor(private appService: AppService,
              private ngbModalService: NgbModal,
              private toastService: ToastService,
              private menuBusinessService: MenuBusinessService,
              private modalService: ModalService
  ) {
    this.appService.titleEventEmitter.emit("菜单管理");
  }

  setting: any = {
    view: {
      addHoverDom: this.addHoverDom,
      removeHoverDom: this.removeHoverDom,
      selectedMulti: false,
      showIcon: this.isShowIcon
    },
    edit: {
      enable: true,
      showRemoveBtn: false,
      showRenameBtn: false,
      drag: {
        autoExpandTrigger: true,
        prev: this.dropPrev,
        inner: this.dropInner,
        next: this.dropNext
      }
    },
    data: {
      simpleData: {
        enable: true
      }
    },
    callback: {
      beforeDrag: this.beforeDrag,
      beforeDrop: (treeId, treeNodes, targetNode, moveType) => {
        this.eidtSort(treeNodes[0].id, parseInt(targetNode.functionOrder), parseInt(treeNodes[0].functionOrder));
      }
    }
  }

  isShowIcon(treeId, treeNode) {
    if (treeNode.iconSkin) {
      return true;
    } else {
      return false;
    }
  }

  curDragNodes: any;

  beforeDrag(treeId, treeNodes, targetNode, moveType) {
    for (let i = 0; i < treeNodes.length; i++) {
      if (treeNodes[i].drag === false || treeNodes[i].functionUrl === null) {
        this.curDragNodes = null;
        return false;
      } else if (treeNodes[i].parentTId && treeNodes[i].getParentNode().childDrag === false) {
        this.curDragNodes = null;
        return false;
      }
    }
    this.curDragNodes = treeNodes;
    return true;
  }


  eidtSort(id, sort, oldsort) {
    let that = this;
    let param = {id: id, sort: sort, oldsort: oldsort};
    this.menuBusinessService.saveSort(param, function(){
      that.getMenuList();
    });
  }

  dropPrev(treeId, nodes, targetNode) {
    let pNode = targetNode.getParentNode();
    if (pNode && pNode.dropInner === false) {
      return false;
    } else {
      for (let i = 0; i < this.curDragNodes.length; i++) {
        let curPNode = this.curDragNodes[i].getParentNode();
        if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
          return false;
        }
      }
    }
    return true;
  }

  dropInner(treeId, nodes, targetNode) {
    if (targetNode && targetNode.dropInner === false && (nodes.functionUrl != null || nodes.functionUrl != "")) {
      return false;
    } else {
      for (let i = 0; i < this.curDragNodes.length; i++) {
        if (!targetNode && this.curDragNodes[i].dropRoot === false) {
          return false;
        } else if (this.curDragNodes[i].parentTId && this.curDragNodes[i].getParentNode() !== targetNode && this.curDragNodes[i].getParentNode().childOuter === false) {
          return false;
        }
      }
    }
    return true;
  }

  dropNext(treeId, nodes, targetNode) {
    let pNode = targetNode.getParentNode();
    if (pNode && pNode.dropInner === false) {
      return false;
    } else {
      for (let i = 0; i < this.curDragNodes.length; i++) {
        let curPNode = this.curDragNodes[i].getParentNode();
        if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
          return false;
        }
      }
    }
    return true;
  }

  ngOnInit() {
    let that = this;
    this.setting.callback.onClick = function (event, treeId, treeNode, clickFlag) {
      if (event.target.id.indexOf("addBtn_") != -1) {
        that.saveNode("add", treeNode);
      } else if (event.target.id.indexOf("removeBtn_") != -1){
        that.removeNode(treeNode.id);
      } else if (event.target.id.indexOf("editBtn_") != -1){
        that.saveNode("edit", treeNode);
      }
    };

    this.getMenuList();
  }

  menuSaveModal: any = null;

  ngOnDestroy() {
    if (this.menuSaveModal != null) {
      this.menuSaveModal.close();
    }
  }

  getMenuList() {
    let that = this;
    this.menuBusinessService.getMenuList(function(data) {
      let newData = {id: 0, name: "系统平台菜单管理", children: data.obj};
      that.ztreeInstance.resetTree(newData);
      that.ztreeInstance.expandTree(true);
      that.appService.updateMenus.emit(data.obj);
    });
  }

  addHoverDom(treeId, treeNode) {
    let that = this;
    let sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    let addStr = "";
    if (treeNode.id === 0) {
      addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='新增'  data-toggle='modal'>";
    } else if(treeNode.children.length > 0) {
      addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='新增'  data-toggle='modal'></span><span class='button edit' id='editBtn_" + treeNode.tId
        + "' title='编辑'  data-toggle='modal'></span>";
    } else {
      addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='新增'  data-toggle='modal'></span><span class='button edit' id='editBtn_" + treeNode.tId
        + "' title='编辑'  data-toggle='modal'></span><span class='button remove' id='removeBtn_" + treeNode.tId
        + "' title='删除'  data-toggle='modal'></span>";
    }
    sObj.after(addStr);
  }

  removeNode (id) {
    let that = this;
    let exitSysCfg = new ConfirmConfig('确认删除该条数据？');
    this.modalService.confirm(exitSysCfg).then((result) => {
      that.menuBusinessService.removeMenu(id, function(data) {
        that.getMenuList();
        that.toastService.toast(new ToastConfig(ToastType.SUCCESS, '', '删除成功！', 2000));
      });
    }, (reason) => {
    });
  }

  saveNode(modalType, modalData) {
    let that = this;
    this.menuSaveModal = this.ngbModalService.open(MenuSaveComponent);
    this.menuSaveModal.componentInstance.modalType = modalType;
    this.menuSaveModal.componentInstance.modalData = modalData;
    this.menuSaveModal.result.then((result) => {
    }, (reason) => {
      that.getMenuList();
    });
  }


  removeHoverDom(treeId, treeNode) {
    let btns = "#addBtn_"+treeNode.tId + ", #editBtn_"+treeNode.tId + ", #removeBtn_"+treeNode.tId;
    $(btns).unbind().remove();
  }
}
