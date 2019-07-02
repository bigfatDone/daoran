import {Component, OnInit, Input, EventEmitter, Output, ViewChild, OnChanges} from '@angular/core';

@Component({
  selector: 'c-dropdown',
  templateUrl: './c-dropdown.component.html',
  styleUrls: ['./c-dropdown.component.scss']
})
export class CDropdownComponent implements OnInit, OnChanges {
  @Input() showData: any;
  @Output() checkBack = new EventEmitter<any>();
  ngOnInit() {
    console.log(this.showData);
  }
  ngOnChanges() {
    console.log(this.showData);
  }
  checkFather() {
    this.checkBack.emit('我是儿子！');
    console.log('ceshi erzi');
  }
}

