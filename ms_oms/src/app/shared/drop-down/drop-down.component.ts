import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit, OnChanges {
  @Input() list: any;
  @Input() defaultList: any;
  @Input() allcheak: boolean;
  @Input() title: any;
  @Output() child: EventEmitter<any> = new EventEmitter();
  iFshow = true;
  cheakList = [];
  chooseList = [];
  sum: any;
  isFirst = true;
  constructor() { }

  ngOnInit() {
    this.cheakList = this.list;
    this.sum = this.title;
    this.hideDropDownList = this.hideDropDownList.bind(this);
  }
  focus() {
    this.iFshow = !this.iFshow;
  }
  choose(isTrue, key) {
    this.chooseList = [];
    this.cheakList[key].isTrue = isTrue;
    for (let i = 0; i < this.cheakList.length; i++) {
      if (this.cheakList[i].isTrue) {
        this.chooseList.push(this.cheakList[i].id);
      }
    }
    if (this.chooseList.length <= 0) {
      this.sum = this.title;
    } else {
      this.sum = '已选' + this.chooseList.length + '个';
    }
    this.child.emit(this.chooseList);
  }
  // 点击窗口元素时隐藏下拉菜单
  hideDropDownList(event) {
    this.iFshow = true;
    document.removeEventListener('click', this.hideDropDownList, false);
  }
  hideSelectBox(event) {
    document.addEventListener('click', this.hideDropDownList, false);
    event.stopPropagation();
  }
  allcheakFun() {
    this.sum = '全选';
    this.chooseList = [];
    for (let i = 0; i < this.cheakList.length; i++) {
      this.cheakList[i].isTrue = true;
      this.chooseList.push(this.cheakList[i].id);
    }
    this.child.emit(this.chooseList);
  }
  noAllCheakFun() {
    this.chooseList = [];
    for (let i = 0; i < this.cheakList.length; i++) {
      if (this.cheakList[i].isTrue) {
        this.cheakList[i].isTrue = false;
      } else {
        this.cheakList[i].isTrue = true;
        this.chooseList.push(this.cheakList[i].id);
      }
    }
    if (this.chooseList.length <= 0) {
      this.sum = this.title;
    } else {
      this.sum = '已选' + this.chooseList.length + '个';
    }
    this.child.emit(this.chooseList);
  }
  ngOnChanges() {
    this.cheakList = this.list;
    this.chooseList = [];
    this.sum = this.title;
    this.child.emit(this.chooseList);
    const that = this;
    if (this.defaultList !== undefined && this.list.length > 0 && this.isFirst) {
      this.list.forEach( (el, ind) => {
        if (that.defaultList.indexOf(el.id) !== -1) {
          that.cheakList[ind].isTrue = true;
        }
      });
      if (this.defaultList.split(',').length === this.list.length) {
        this.sum = '全选';
      } else {
        if (this.defaultList !== '') {
          this.sum = '已选' + this.defaultList.split(',').length + '个';
        }
      }
      this.isFirst = false;
      this.child.emit(this.defaultList);
    }
  }
}
