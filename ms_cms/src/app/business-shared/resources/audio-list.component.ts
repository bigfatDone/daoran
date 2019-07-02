import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { AppService } from '../../app.service';
import { ResourcesBusinessService} from '../../business-service/resources/resources-business.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {audioSongType, artArea, videoSongType} from '../../global-constant';
import {VideoDeriveComponent} from './video-derive.component';
import {AudioDetailComponent} from './audio-detail.component';
import {CustomScrollbarDirective} from '../../shared/custom-scrollbar/custom-scrollbar.directive';

// import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
// import { DatepickerI18n, DatepickerI18nType } from '../../shared/datepickerI18n/datepickerI18n';
@Component({
  selector: 'c-audio-list',
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.scss'],

  // providers: [DatepickerI18nType, { provide: NgbDatepickerI18n, useClass: DatepickerI18n }]
})
export class AudioListComponent implements OnInit {
  @ViewChild(CustomScrollbarDirective)updateSc: CustomScrollbarDirective;
  audioSongTypes: Array<any>= audioSongType;
  artAreas: Array<any>= artArea;
  artCode: any;
  dataList: Array<any>= [];
  artArea: any = "";
  artCodeName: any = "";
  artName: any = "";
  beDate: any = "";
  enDate: any = "";
  cpIdName: any = "";
  audCode: any = "";
  audType: any = "";
  audName: any = "";
  //获取cp商
  CPs: any = "";

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



  pageOptions: any = {
    rows: 20,
    page: 0,     // 当前页
    pageCount: 0,// 页码数量
  };

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
    this.appService.titleEventEmitter.emit("音频");
  }

  ngOnInit() {
    if(this.actRoute.snapshot.params['artCode']){
      this.artCodeName = this.actRoute.snapshot.params['artCode'];
    }

    this.getList();
    this.getCp();
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
      audioCode:this.audCode,
      audioType:this.audType,
      audioName:this.audName,
      currPage: this.pageOptions.page,
      pageSize: this.pageOptions.rows,
    };
    parmas = {jsonParam:JSON.stringify(parma)};
    this.resourcesBusinessService.audioList(parmas, function(data){
        if (data.data.length > 0 ) {
          data.data.forEach(i => that.dataList.push(i));
          that.updateSc.updateScrollbar();
          // that.isCanLoad = true;
          // that.options.page = data.currPage;
          // that.options.total = data.pageSize;
          // that.options.pageCount = Math.ceil(data.obj.total / data.obj.rows) * data.obj.rows;
        } else {
          that.loadingFlag = false;
        }
        // that.options.total = data.total;
        // that.options.pageCount = Math.ceil(data.total / data.rows) * data.rows;
    });
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

  audioModal: any = null;
  derive(type) {
    let flag;
    let that = this;
    this.audioModal = this.ngbModalService.open(VideoDeriveComponent, {size: 'lg'});
    this.audioModal.componentInstance.deriveData = {
      flag: type,
      artistArea:this.artArea,
      artistCode:this.artCodeName,
      artistName:this.artName,
      beginDate:this.beDate,
      endDate:this.enDate,
      cpId:this.cpIdName,
      audioCode:this.audCode,
      audioType:this.audType,
      audioName:this.audName,
    };
    this.audioModal.result.then((result) => {
      that.getList();
    }, (reason) => {;
    });
  }
  edit(id) {
    this.audioModal = this.ngbModalService.open(AudioDetailComponent, {size: 'lg'});
    this.audioModal.componentInstance.modalData = id;
    this.audioModal.result.then((result) => {
    }, (reason) => {
      this.getList();
    });
  }

  clear () {
    this.dataList = [];
    let t = this;
    t.pageOptions.page = 0;
    t.artCodeName = '',
    t.artName = '',
    t.beDate= '',
    t.enDate= '',
    t.artArea= '',
    t.cpIdName= '',
    t.audCode= '',
    t.audType= '',
    t.audName= '',
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

  checkSingle(ev, index) {
    this.dataList[index].checkState = ev.target.checked;
  }
}
