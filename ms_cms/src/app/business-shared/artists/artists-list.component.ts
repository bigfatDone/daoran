import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../shared/modal/modal.service';
import { ToastService } from '../../shared/toast/toast.service';
import { AppService } from '../../app.service';
import { HttpService } from '../../shared/http/http.service';
import { ArtistsBusinessService} from '../../business-service/artists/artists-business.service';
import { ActivatedRoute } from '@angular/router';
import {VideoDeriveComponent} from '../resources/video-derive.component';
import {artArea, artType} from '../../global-constant';
import {ArtistsDetailComponent} from './artists-detail.component';
import {ArtistsDeriveComponent} from './artists-derive.component';
import {environment} from '../../../environments/environment';
import {CustomScrollbarDirective} from '../../shared/custom-scrollbar/custom-scrollbar.directive';


@Component({
  selector: 'c-artists-list',
  templateUrl: './artists-list.component.html'
})
export class ArtistsListComponent implements OnInit, OnDestroy {
  @ViewChild(CustomScrollbarDirective)updateSc: CustomScrollbarDirective;
  artTypes: Array<any>= artType;
  artAreas: Array<any>= artArea;
  dataList: Array<any>= [];
  artCode: any;
  artArea: any = "";
  artCodeName: any = "";
  artName: any = "";
  artType: any = "";

  showImg: any = "";

  options: any = {
    setWidth: false,
    setHeight: 720,
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

  onPageChanged($event) {
    this.pageOptions.page = $event;
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
              private artistsBusinessService: ArtistsBusinessService,
              private ngbModalService: NgbModal,
  ) {
    this.appService.titleEventEmitter.emit("艺人");
  }

  ngOnInit() {
    if(this.actRoute.snapshot.params['artCode']) {
      this.artCode = this.actRoute.snapshot.params['artCode'];
    }
    this.getList();
    this.showImg = environment.imgApiShow;
  }
  ngOnDestroy(){
    if(this.artistsModal !== null){
      this.artistsModal.close();
    }
  }

  // 获取列表
  loadingFlag = true;
  getList() {
    this.loadingFlag = true;
    let that = this;
    let parmas;
    let parma= {
      artistCode:this.artCodeName,
      artistName:this.artName,
      artistType:this.artType,
      artistArea:this.artArea,
      currPage: this.pageOptions.page,
      pageSize: this.pageOptions.rows,
    };
    parmas = {jsonParam:JSON.stringify(parma)};
    this.artistsBusinessService.ArtistList(parmas, function(data){
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
        // that.options.pageCount = Math.ceil(data.obj.total / data.obj.rows) * data.obj.rows;
    });
  }



  artistsModal: any = null;
  derive() {
    let that = this;
    let flag;
    this.artistsModal = this.ngbModalService.open(ArtistsDeriveComponent, {size: 'lg'});
    this.artistsModal.componentInstance.deriveData = {
      artistArea:this.artArea,
      artistCode:this.artCodeName,
      artistName:this.artName,
      artistType:this.artType,
    };
    this.artistsModal.result.then((result) => {
      that.getList();
    }, (reason) => {
    });
  }
  clear () {
    this.dataList = [];
    this.pageOptions.page = 0;
    this.artCodeName = '',
    this.artName = '',
    this.artType = '',
    this.artArea = '',
    this.getList();
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

  edit(id) {
    let that = this;
    this.artistsModal = this.ngbModalService.open(ArtistsDetailComponent, {size: 'lg'});
    this.artistsModal.componentInstance.modalData = id
    this.artistsModal.result.then((result) => {
    }, (reason) => {
      that.getList();
    });
  }
}
