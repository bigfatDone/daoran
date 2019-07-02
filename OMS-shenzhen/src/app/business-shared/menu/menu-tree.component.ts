import { Component, OnInit, Input } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { MenuTreeData } from './menu-tree-model';
import { AppService } from '../../app.service';

import { MenuSaveComponent} from './menu-save.component';

import { MenuBusinessService} from '../../business-service/menu/menu-business.service';


/**
 * 菜单树组件
 */
@Component({
  selector: 'c-treeview-menu',
  template: `
    <ul class="c-treeview-menu" [hidden]="!treeData.state"  *ngIf="!isLeaf(treeData)">
      <li *ngFor="let item of treeData.childList">
        <a>
          <i class="fa pull-left" [ngClass]="{'fa-angle-down': !isLeaf(item) && item.state, 'fa-angle-up': !isLeaf(item) && !item.state}"></i>
          <i class="fa " [ngClass]="item.code"></i> <span (click)="itemClicked(item);">{{item.text}}</span>
          <button class="btn btn-danger btn-sm c-circle-btn menu-btn-sm" (click)="saveMenu()" title="添加"><i class="fa fa-plus fa-fw"></i></button>
          <button class="btn btn-success btn-sm c-circle-btn menu-btn-sm" (click)="saveMenu()" title="编辑"><i class="fa fa-pencil fa-fw"></i></button>
          <button class="btn btn-success btn-sm c-circle-btn menu-btn-sm" (click)="moveUp()" title="上移"><i class="fa fa-angle-up fa-fw"></i></button>
          <button class="btn btn-success btn-sm c-circle-btn menu-btn-sm" (click)="moveDown()" title="下移"><i class="fa fa-angle-down fa-fw"></i></button>
          <button class="btn btn-danger btn-sm c-circle-btn menu-btn-sm" (click)="delMenu()" title="删除"><i class="fa fa-trash-o fa-fw"></i></button>
        </a>
        <c-treeview-menu [treeData]="item"></c-treeview-menu>
      </li>
    </ul>
  `,
  styleUrls: ['./menu-tree.component.scss']
})

export class MenuTreeComponent {

  @Input() treeData;

  setting = {
    edit: {
      enable: true,
      showRemoveBtn: false,
      showRenameBtn: false
    },
    data: {
      simpleData: {
        enable: true
      }
    },
    callback: {
      beforeDrag: this.beforeDrag,
      beforeDrop: this.beforeDrop
    }
  };
  beforeDrag(treeId, treeNodes) {
    for (var i=0,l=treeNodes.length; i<l; i++) {
      if (treeNodes[i].drag === false) {
        return false;
      }
    }
    return true;
  }
  beforeDrop(treeId, treeNodes, targetNode, moveType) {
    return targetNode ? targetNode.drop !== false : true;
  }


  constructor(
    private menuBusinessService: MenuBusinessService,
    private ngbModalService: NgbModal) {
  }

  saveMenu () {
    this.ngbModalService.open(MenuSaveComponent).result.then((result) => {
    }, (reason) => {

    });
  }

  moveUp () {

  }

  moveDown () {

  }

  delMenu () {

  }

  /**
   * 是否有子节点
   * @param item
   */
  isLeaf(item: MenuTreeData) {
    return !item.childList || !item.childList.length;
  }


}
