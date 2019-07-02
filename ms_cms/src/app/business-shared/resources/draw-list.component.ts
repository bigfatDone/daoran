import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { ResourcesBusinessService} from '../../business-service/resources/resources-business.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {VideoDeriveComponent} from './video-derive.component';
import {paintSongType, artArea} from '../../global-constant';
import {environment} from '../../../environments/environment';
import {CustomScrollbarDirective} from '../../shared/custom-scrollbar/custom-scrollbar.directive';

@Component({
  selector: 'c-draw-list',
  templateUrl: './draw-list.component.html',
  styleUrls: ['./draw-list.component.scss'],
})
export class DrawListComponent implements OnInit {
  @ViewChild(CustomScrollbarDirective)updateSc: CustomScrollbarDirective;
  paintSongTypes: Array<any>= paintSongType;
  artAreas: Array<any>= artArea;
  artCode: any;
  dataList: Array<any>= [];
  artArea: any = "";
  artCodeName: any = "";
  artName: any = "";
  beDate: any = "";
  enDate: any = "";
  cpIdName: any = "";
  drawCode: any = "";
  drawType: any = "";
  drawName: any = "";

  showImg: any = "";
  CPs: any = "";

  isCanLoad: Boolean = true;
  options: any = {
    setWidth: false,
    setHeight: 670,
    axis: 'xy',
    theme: 'minimal-dark',
    autoDraggerLength: true,
    advanced: {
      updateOnContentResize: true
    },
    callbacks:{
      onTotalScroll:_ => {
        this.pageOptions.page +=1;
        // this.pageOptions.rows +=9;
        this.getList();
      },
    }
  };

  canLoadData () {
    if(this.isCanLoad) {
      this.isCanLoad = false;
      this.pageOptions.page +=1;
      this.getList();
    }
  }



  pageOptions: any = {
    rows: 20,
    page: 0,     // 当前页
    pageCount: 0,// 页码数量
  };

  onPageChanged($event) {
    this.options.page = $event;
    this.getList();
  }

  userName: String;
  realName: String;
  search() {
    this.dataList = [];
    this.pageOptions.page = 0;
    this.getList();
  }

  constructor(private appService: AppService,
              private actRoute: ActivatedRoute,
              private resourcesBusinessService: ResourcesBusinessService,
              private ngbModalService: NgbModal,
              ) {
    this.appService.titleEventEmitter.emit("手绘本");
  }

  ngOnInit() {
    if(this.actRoute.snapshot.params['artCode']){
      this.artCode = this.actRoute.snapshot.params['artCode'];
    }
    this.getList();
    this.getCp();
    this.showImg = environment.imgApiShow;
  }
  loadingFlag = true;
  getList() {
    this.loadingFlag = true;
    let that = this;
    let parmas;
    if(typeof(this.beDate) ==="object"&& this.enDate ==="" ){
      this.beDate = (this.beDate.year + "-" + this.beDate.month + "-" + this.beDate.day).toString();
      this.enDate = "";
    }
    if(this.beDate ==="" && typeof(this.enDate) ==="object"){
      this.beDate = "";
      this.enDate = (this.enDate.year + "-" + this.enDate.month + "-" + this.enDate.day).toString();
    }
    if(typeof(this.beDate) ==="object" && typeof(this.enDate) ==="object"  ){
      this.beDate = (this.beDate.year + "-" + this.beDate.month + "-" + this.beDate.day).toString();
      this.enDate = (this.enDate.year + "-" + this.enDate.month + "-" + this.enDate.day).toString();
    }
    if(typeof(this.beDate) ==="string" && typeof(this.enDate) ==="object"  ){
      // this.beDate = (this.beDate.year + "-" + this.beDate.month + "-" + this.beDate.day).toString();
      this.enDate = (this.enDate.year + "-" + this.enDate.month + "-" + this.enDate.day).toString();
    }
    if(typeof(this.beDate) ==="object" && typeof(this.enDate) ==="string"  ){
      this.beDate = (this.beDate.year + "-" + this.beDate.month + "-" + this.beDate.day).toString();
      // this.enDate = (this.enDate.year + "-" + this.enDate.month + "-" + this.enDate.day).toString();
    }
    let parma= {
      artistArea:this.artArea,
      artistCode:this.artCodeName,
      artistName:this.artName,
      beginDate:this.beDate,
      endDate:this.enDate,
      cpId:this.cpIdName,
      paintCode:this.drawCode,
      type:this.drawType,
      paintName:this.drawName,
      currPage: this.pageOptions.page,
      pageSize: this.pageOptions.rows,
    };
    parmas = {jsonParam:JSON.stringify(parma)};
    this.resourcesBusinessService.drawList(parmas, function(data){
        if (data.length > 0 ) {
          data.forEach(i => that.dataList.push(i));
          that.updateSc.updateScrollbar();
          // that.isCanLoad = true;
          // that.options.page = data.currPage;
          // that.options.total = data.pageSize;
          // that.options.pageCount = Math.ceil(data.obj.total / data.obj.rows) * data.obj.rows;
        } else {
          that.loadingFlag = false;
        }
        // that.options.page = data.currPage;
        // that.options.total = data.pageSize;
    });
  }
  drawModal: any = null;
  // edit(id) {
  //   let that = this;
  //   this.drawModal = this.ngbModalService.open(VideoEditComponent, {size: 'lg'});
  //   this.drawModal.componentInstance.modalData = {
  //     flag: "draw",
  //     parma: id,
  //   }
  // }
  derive(type) {
    let that = this;
    let flag;
    this.drawModal = this.ngbModalService.open(VideoDeriveComponent, {size: 'lg'});
    this.drawModal.componentInstance.deriveData = {
      flag:type,
      artistArea:this.artArea,
      artistCode:this.artCodeName,
      artistName:this.artName,
      beginDate:this.beDate,
      endDate:this.enDate,
      cpId:this.cpIdName,
      paintCode:this.drawCode,
      paintType:this.drawType,
      paintName:this.drawName,
    };
    this.drawModal.result.then((result) => {
      that.getList();
    }, (reason) => {
    });
  }
  clear () {
    let t = this;
    this.dataList = [];
    t.pageOptions.page = 0;
    this.artArea = '',
    t.userName = '';
    t.realName = '';
    t.artCodeName= '',
    t.artName = '',
    t.beDate= '',
    t.enDate= '',
    t.cpIdName= '',
    t.drawCode= '',
    t.drawType= '',
    t.drawName= '',
    t.getList();
  }

  checkAll(ev) {
    this.dataList.forEach(x => x.checkState = ev.target.checked);
  }

  isAllChecked() {
    if ( this.dataList.length > 0) {
      return this.dataList.every(_ => _.checkState);
    }
  }
// 获取cp商
  getCp() {
    let that = this;
    this.resourcesBusinessService.getCpPost(function(data){
      if (data.data) {
        that.CPs = data.data;
      }
    });
  }
  checkSingle(ev, index) {
    this.dataList[index].checkState = ev.target.checked;
  }
}
