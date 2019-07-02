import {Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { ResourcesBusinessService} from '../../business-service/resources/resources-business.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {VideoDeriveComponent} from './video-derive.component';
import {videoSongType, artArea} from '../../global-constant';
import {environment} from '../../../environments/environment';
import {CustomScrollbarDirective} from '../../shared/custom-scrollbar/custom-scrollbar.directive';


@Component({
  selector: 'c-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit, OnDestroy {
  @ViewChild(CustomScrollbarDirective)updateSc: CustomScrollbarDirective;
  videoSongTypes: Array<any>= videoSongType;
  artAreas: Array<any>= artArea;
  dataList: Array<any>= [];
  CPs: Array<any>= [];
  artCode: any;
  artArea: any = "";
  artCodeName: any = "";
  artName: any = "";
  beDate: any = "";
  enDate: any = "";
  cpIdName: any = "";
  vidCode: any = "";
  vidType: any = "";
  vidName: any = "";

  showImg: any = "";
  taht = this;

  isCanLoad: Boolean = true;
  canLoadData () {
    if(this.isCanLoad) {
      this.isCanLoad = false;
      this.pageOptions.page +=1;
      this.getList();
    }
  }

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

  ngOnInit() {
    if(this.actRoute.snapshot.params['artCode']){
      this.artCodeName = this.actRoute.snapshot.params['artCode'];
    }
    this.getList();
    this.getCp();
    this.showImg = environment.imgApiShow;
  }

  ngOnDestroy(){
    if(this.videoModal !== null){
      this.videoModal.close();
    }
  }

  getScroll(){
    let myScroll = document.getElementById("")
  }

  onPageChanged($event) {
    // this.pageOptions.page = $event;
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
    this.appService.titleEventEmitter.emit("视频");
  }



  // 获取列表
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
        videoCode:this.vidCode,
        videoType:this.vidType,
        videoName:this.vidName,
        currPage: this.pageOptions.page,
        pageSize: this.pageOptions.rows,
    };
    parmas = {jsonParam:JSON.stringify(parma)};
    this.resourcesBusinessService.videoList(parmas, function(data){
      if (data.length > 0) {
        data.forEach(i => that.dataList.push(i));
        that.updateSc.updateScrollbar();
        // that.isCanLoad = true;
        // that.options.page = data.currPage;
        // that.options.total = data.pageSize;
        // that.options.pageCount = Math.ceil(data.obj.total / data.obj.rows) * data.obj.rows;
      } else {
        that.loadingFlag = false;
      }
    });
  }


  getCp() {
    let that = this;
    this.resourcesBusinessService.getCpPost(function(data){
      if (data.data) {
        that.CPs = data.data;
      }
    });
  }

  videoModal: any = null;
  derive(type) {
    let that = this;
    let flag;
    this.videoModal = this.ngbModalService.open(VideoDeriveComponent, {size: 'lg'});
    this.videoModal.componentInstance.deriveData = {
      flag:type,
      artistArea:this.artArea,
      artistCode:this.artCodeName,
      artistName:this.artName,
      beginDate:this.beDate,
      endDate:this.enDate,
      cpId:this.cpIdName,
      videoCode:this.vidCode,
      videoType:this.vidType,
      videoName:this.vidName,
    };
    this.videoModal.result.then((result) => {
      that.getList();
    }, (reason) => {
    });
  }
  // edit(id) {
  //   let that = this;
  //   this.videoModal = this.ngbModalService.open(VideoEditComponent, {size: 'lg'});
  //   this.videoModal.componentInstance.modalData = {
  //     flag:"video",
  //     parma:id,
  //   };
  //   this.videoModal.result.then((result) => {
  //   }, (reason) => {
  //     that.getList();
  //   });
  // }
  clear () {
    let t = this;
    this.dataList = [];
    t.pageOptions.page = 0;
    t.userName = '';
    t.realName = '';
    t.artCodeName= '',
    t.artName = '',
    t.beDate= '',
    t.enDate= '',
    t.cpIdName= '',
    t.vidCode= '',
    t.vidType= '',
    t.vidName= '',
    t.artArea= '',
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
