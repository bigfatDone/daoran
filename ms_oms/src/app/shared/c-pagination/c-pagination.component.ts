import { Component, OnInit, Input,  EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'c-pagination',
  templateUrl: './c-pagination.component.html',
  styleUrls: ['./c-pagination.component.scss']
})
export class CPaginationComponent implements OnInit {
  @ViewChild(NgbPagination) child: NgbPagination;

  @Input() pageInput: number = 1;

  @Input() boundaryLinks: boolean = false;

  @Input() collectionSize: number = 0;

  @Input() directionLinks: boolean = true;

  @Input() disabled: boolean = false;

  @Input() ellipses: boolean = true;

  @Input() maxSize: number = 5;

  @Input() page: number = 0;

  @Input() total: number = 0;

  @Input() pageSize: number = 0;

  @Input() rotate: boolean = false;

  @Input() size: 'sm' | 'lg';

  @Output() pageChange = new EventEmitter<number>();

  totalPage: number = 0;

  constructor() { }

  ngOnInit(){
    this.totalPage = Math.ceil(this.total / this.pageSize);
  }

  onPageChange(current_page) {
    this.page = current_page;
    this.pageInput = current_page;
    this.pageChange.emit(current_page);
  }

  goToPage() {
    // this.child.pageChange
    this.child.selectPage(this.pageInput);
    // this.onPageChange(this.pageInput);
  }
}
