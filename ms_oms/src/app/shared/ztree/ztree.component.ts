import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Utils } from '../util/utils';

declare var $: any;

@Component({
  selector: 'c-ztree',
  template: `
       <!--<div [hidden]="searchMsgHidden" class="c-ztree-search-box">搜索的数据不存在...</div>-->
       <div #ztree [hidden]="!searchMsgHidden"></div>
  `,
  styleUrls:['./ztree.component.scss']
})
export class ZtreeComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('ztree') ztree: ElementRef;

  //配置
  @Input() setting: any = {};

  //输入数据
  @Input() zNodes: any = [];

  //ztreeId
  @Input() ztreeId: any;

  @Output()
  onViewInit = new EventEmitter();

  //实例
  private ztreeInstance: any;

  //搜索隐藏
  searchMsgHidden: boolean = true;


  constructor() {

  }

  ngOnInit() {

  }


  ngAfterViewInit() {
    let result = this.createTree();
    if (result) {
      setTimeout(() => {
        this.onViewInit.emit();
      }, 6)
    }
  }

  /**
   * 销毁
   */
  ngOnDestroy() {
    this.destroyTree();
  }

  /**
   * 创建树
   */
  private createTree() {
    //防止一个页面中多个id冲突
    let ztreeId = "";
    if(this.ztreeId != ""){
      ztreeId = this.ztreeId;
    } else {
      ztreeId = "ztree" + Utils.shortUUID();
    }
    let ztreeUL = document.createElement('ul');
    ztreeUL.id = ztreeId;
    ztreeUL.className = "ztree";
    this.ztree.nativeElement.appendChild(ztreeUL);
    this.ztreeInstance = $.fn.zTree.init($('#' + ztreeId), this.setting, this.zNodes);
    return true;
  }

  /**
   * 获得树id
   */
  private getTreeId() {
    return this.ztreeInstance.setting.treeId;
  }

  /**
   * 重置树
   * @param nodes
   */
  resetTree(nodes: any) {
    $.fn.zTree.init($('#' + this.getTreeId()), this.setting, nodes);
  }

  /**
   * 检查节点是否存在
   * @param searchNodes
   * @param curNode
   */
  private checkSearchTreeExists(searchNodes:Array<any>,curNode:any){
    for(let node of searchNodes){
      if(node.id==curNode.id){
        return true;
      }else{
        let children=node.children;
        if(children && children.length>0){
          return this.checkSearchTreeExists(children,curNode);
        }
      }
    }
    return false;
  }


  /**
   * 获得ztree实例
   */
  getTreeInstance() {
    return this.ztreeInstance;
  }

  // 销毁树
  destroyTree() {
    if (this.ztreeInstance) {
      $.fn.zTree.destroy(this.ztreeInstance);
    }
  }

  // 展开/折叠 全部节点
  expandTree ( bool: boolean ) {
    this.ztreeInstance.expandAll(bool);
  }

  /**
   * 搜索节点
   * @param searchTxt
   */
  searchTree(searchTxt: string = '') {
    searchTxt = searchTxt.trim();
    this.searchMsgHidden = true;
    this.resetTree(this.zNodes);
    if ('' != searchTxt) {
      let keyWord = new RegExp(searchTxt);
      let searchNodes=new Array<any>();
      let that = this;
      var nodes = this.ztreeInstance.getNodesByFilter(function (node) {
        //判断name或是keyWord是否匹配
        if (node.name.match(keyWord) || (node.keyWord && node.keyWord.match(keyWord)) && !that.checkSearchTreeExists(searchNodes,node)) {
          searchNodes.push(node);
          return true;
        } else {
          return false;
        }
      });

      if (nodes && nodes.length > 0) {
        this.resetTree(nodes);
      }else{
        this.searchMsgHidden = false;
      }

    }
  }

  /**
   * 选择节点
   * @param nodeArray
   */
  checkedNodes(nodeArray:Array<any>){
    for(let node of this.ztreeInstance.transformToArray(this.zNodes)){
      node.checked=false;
      for(let ckNode of nodeArray){
        if(ckNode.id==node.id){
          node.checked=true;
          break;
        }
      }
    }
  }

  /**
   * 选择节点
   */
  checkPreNode(checkedNode: Array<any>) {
    for (let ckNode of checkedNode){
      let objNode = this.ztreeInstance.getNodeByParam('id', ckNode.pid);
      if (objNode) {
        this.ztreeInstance.checkNode(objNode, true );
      }
    }
  }

  /*20180626 wuhua for 岗位权限数据结构处理 start*/
  SelectedFormat (arr: Array<any>) {
    let that = this;
    let hash = {
      itemCode: true,
      provinceCode: true,
      productCode: true
    };
    let result = [];
    arr.forEach((item, index) => {
      let _key = undefined;

      for (let i in hash) {
        if (item[i]) {
          _key = i;
        }
      }
      if (_key && item.children) {
        let param = {name: item.name};
        let child = that.SelectedFormat(item.children);
        param[_key] = item[_key];
        result.push(item);
      }else if (_key) {
        let param = {name: item.name};
        param[_key] = item[_key];
        result.push(item);
      }
    });

    return result;
  }

  FormatProductCode (child, parent) {
    let that = this;
    child.forEach(item => {
      let objNode = that.ztreeInstance.getNodeByParam("productCode", item.productCode, parent);
      that.ztreeInstance.checkNode(objNode, true);
    });
  }

  FormatProvinceCode (data, parent) {
    let that = this;
    data.forEach(child => {
      let objNode = that.ztreeInstance.getNodeByParam('provinceCode', child.provinceCode, parent);
      that.ztreeInstance.checkNode(objNode, true);
      if (child.children.length > 0) {
        that.FormatProductCode(child.children, objNode);
      }
    });
  }

  FormatNodeCode (data) {
    let that = this;
    let hash = {
      itemCode: true,
      provinceCode: true,
      productCode: true
    };
    data.forEach(item => {
      let objNode = that.ztreeInstance.getNodeByParam('itemCode', item.itemCode);
      that.ztreeInstance.checkNode(objNode, true);
      if (item.children.length > 0) {
        that.FormatProvinceCode(item.children, objNode);
      }
    });
  }

  checkPreNode_postID (checkedNode: Array<any>) {
    let that = this;
    let parent = [];
    let hash = {
      itemCode: true,
      provinceCode: true,
      productCode: true
    };
    let data = this.SelectedFormat(checkedNode);
    that.FormatNodeCode(data);
  }
  /*20180626 wuhua for 岗位权限数据结构处理 end*/
}
