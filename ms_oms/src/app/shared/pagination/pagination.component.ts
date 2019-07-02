import { Component, Input, Output, OnInit, SimpleChanges, EventEmitter } from '@angular/core';

import { PaginationType, PaginationOptions } from './pagination-model';



/**
 * 分页组件
 */
@Component({
  selector: 'c-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input()
  total: number = 0;

  @Input()
  pageList: Array<number> = [5, 10, 20, 30, 50, 100, 150, 200];

  @Input()
  btnCls: string = 'btn-light';

  @Output()
  onPageChanged = new EventEmitter();

  options = new PaginationOptions();

  showNumber: number = 5;

  constructor() { }

  /**
   * 改变
   * @param changes
   */
  ngOnInit() {
    this.options.total = this.total;
    this.options.pageList = this.pageList;
    this.options.pageSize = this.options.pageList[0];
    this.refreshPage();
    this.pageOperation(PaginationType.PAGE_INIT);
  }

  /**
   * 刷新分页
   */
  refreshPage() {
    this.options.pageTotal = 0;
    if (Number.parseInt(this.options.total) % Number.parseInt(this.options.pageSize) == 0) {
      this.options.pageTotal = Number.parseInt(this.options.total) / Number.parseInt(this.options.pageSize);
    } else {
      this.options.pageTotal = Number.parseInt(this.options.total) / Number.parseInt(this.options.pageSize) + 1;
    }
    this.options.pageTotal = Number.parseInt(this.options.pageTotal);

    if (this.options.pageTotal <= 0) {
      this.options.pageNumber = 0;
    } else {
      this.options.pageNumber = 1;
    }
  }


  /**
   * 下一页
   */
  nextPage() {
    this.options.pageNumber++;
    if (this.options.pageNumber > this.options.pageTotal) {
      this.options.pageNumber = this.options.pageTotal;
    }
  }

  /**
   * 上一页
   */
  previousPage() {
    this.options.pageNumber--;
    if (this.options.pageNumber <= 0) {
      this.options.pageNumber = 1;
    }
  }

  /**
   * 最后一页
   */
  lastPage() {
    this.options.pageNumber = this.options.pageTotal;
  }

  /**
   * 第一页
   */
  fristPage() {
    this.options.pageNumber = 1;
  }

  /**
   * 分页操作
   * @param type  操作类型
   */
  pageOperation(type) {
    let pageParam = {
      pageNumber: type,
      pageSize: this.options.pageSize,
      pageTotal: this.options.pageTotal,
      total: this.options.total,
      type: type,
    }
    if (typeof type === "number")this.options.pageNumber = type;

    this.showPages();
    this.onPageChanged.emit(pageParam);
  }

  /**
   * 分页改变
   * @param type 操作类型
   */
  pageChanged(type) {
    switch (type) {
      case PaginationType.NEXT_PAGE:
        this.nextPage();
        break;
      case PaginationType.LAST_PAGE:
        this.lastPage();
        break;
      case PaginationType.PREVIOUS_PAGE:
        this.previousPage();
        break;
      case PaginationType.FRIST_PAGE:
        this.fristPage();
        break;
    }
    this.pageOperation(type);
  }

  /**
   * 页数改变
   * @param $event  当前条件
   */
  pageSizeChanged($event) {
    this.options.pageSize = Number.parseInt($event);
    this.refreshPage();
    this.pageOperation(PaginationType.PAGE_SIZE_CHANGE);
  }

  /**
   * @return {showPageArr} 返回要显示的页码数组
   */
  showPageArr: any;
  showPages() { // 返回显示的页码数组
    let that = this;
    const rangeArray = (start, end) => Array(end - start + 1).fill(0).map((v, i) => i + start);
    if (that.options.pageTotal < that.showNumber || that.options.pageTotal === that.showNumber) {
      that.showPageArr = rangeArray(1, that.options.pageTotal);
    } else {
      if ((that.options.pageNumber + that.showNumber) > that.options.pageTotal) {
        this.showPageArr = rangeArray((that.options.pageTotal - that.showNumber + 1), this.options.pageTotal);
      } else if (that.options.pageNumber === 1) {
        this.showPageArr = rangeArray(that.options.pageNumber, (that.options.pageNumber + that.showNumber - 1));
      } else {
        this.showPageArr = rangeArray((that.options.pageNumber - 1), (that.options.pageNumber + that.showNumber - 2));
      }
    }
    return this.showPageArr ;
  }

}
