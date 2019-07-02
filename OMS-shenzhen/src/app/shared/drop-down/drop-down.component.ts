import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit, OnChanges {
  @Input() list: any;
  @Output() child: EventEmitter<any> = new EventEmitter();
  iFshow = true;
  cheakList = [];
  chooseList = [];
  sum: any;
  constructor() { }

  ngOnInit() {
    this.cheakList = this.list;
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
    this.sum = '已选' + this.chooseList.length + '个';
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
  ngOnChanges() {
    if (this.list.length === 0) {
      this.sum = '';
      this.chooseList = [];
      this.child.emit(this.chooseList);
      for (let i = 0; i < this.cheakList.length; i++) {
        this.cheakList[i].isTrue = false;
      }
    }
    for (let i = 0; i < this.list.length; i++) {
      this.cheakList.push({isTrue: false, txt: this.list[i].name, id: this.list[i].id  });
    }
  }
}
