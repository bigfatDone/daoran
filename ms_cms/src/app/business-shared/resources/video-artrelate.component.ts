import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { ResourcesBusinessService} from '../../business-service/resources/resources-business.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastConfig, ToastType} from '../../shared/toast/toast-model';
import {ToastService} from '../../shared/toast/toast.service';
import {CustomScrollbarDirective} from '../../shared/custom-scrollbar/custom-scrollbar.directive';

@Component({
  selector: 'c-video-artrelate',
  templateUrl: './video-artrelate.component.html'
})
export class VideoArtrelateComponent implements OnInit {
  @ViewChild(CustomScrollbarDirective)updateSc: CustomScrollbarDirective;
  dataDetail: any;
  chooseArtistData: any = "";

  detailId: any;
  options: any = {
    setWidth: false,
    setHeight: 400,
    axis: 'xy',
    theme: 'minimal-dark',
    autoDraggerLength: true,
    advanced: {
      updateOnContentResize: true
    },
    callbacks:{
      onTotalScroll:_ => {
        this.pageOptions.page +=1;
        this.getRateList();
      },
    }
  };

  pageOptions: any = {
    rows: 20,
    page: 0,     // 当前页
    pageCount: 0,// 页码数量
  };

  constructor(private appService: AppService,
              private resourcesBusinessService: ResourcesBusinessService,
              private actRoute: ActivatedRoute,
              public activeModal: NgbActiveModal,
              private toastService: ToastService
              ) {
  }
  dataList:Array<any>= [];
  ngOnInit() {
    this.getRateList();
    this.detailId = this.actRoute.snapshot.params['id'];
  }

  getInfo() {
    let that = this;
    let params = {};
    this.resourcesBusinessService.videoInfo(params, function(data){
      if (data.obj) {
        that.dataDetail = data.obj
      }
    });
  }
  checkSingle(ev, index) {
    this.dataList[index].checkState = ev.target.checked;
  }

  isAllChecked() {
    if ( this.dataList.length > 0) {
      return this.dataList.every(_ => _.checkState);
    }
  }

  checkAll(ev) {
    this.dataList.forEach(x => x.checkState = ev.target.checked);
  }
  artCode: any = '';
  artName: any = '';
  loadingFlag = false;
  getRateList(){
    this.loadingFlag = true;
    let that = this;
    let parmas;
    let parma;
    parma= {
      artistCode: this.artCode,
      artistName: this.artName,
      currPage: this.pageOptions.page,
      pageSize: this.pageOptions.rows,
    };
    parmas = {jsonParam:JSON.stringify(parma)};
    this.resourcesBusinessService.chooseArtist(parmas, function(data){
      if (data.length > 0 ) {
        data.forEach(i => that.dataList.push(i));
        that.updateSc.updateScrollbar();
      } else {
        that.loadingFlag = false;
      }
    });
  }
  search(){
    this.dataList = [];
    this.pageOptions.page = 0;
    this.getRateList();
  }
  clear(){
    this.dataList = [];
    this.artCode = '',
    this.artName = '',
    this.getRateList();
  }

  getCheckedIds() {
    let ids = [];
    this.dataList.forEach(i => {
      if (i.checkState) {
        ids.push(i.artistCode);
      }
    });
    return ids.toString();
  }
  ok(): void {
    let that = this;
    let param: any;
    let params;
    //let categoryVal = this.getCategory();
      param =  {
        artistCode: this.getCheckedIds(),
        // resCode:
      };
      if(this.chooseArtistData.videoCode){
        param.resCode = this.chooseArtistData.videoCode;
      } else if(this.chooseArtistData.audioCode){
        param.resCode = this.chooseArtistData.audioCode;
      } else if(this.chooseArtistData.paintCode){
        param.resCode = this.chooseArtistData.paintCode;
      }
    params = {jsonParam:JSON.stringify(param)};
      this.resourcesBusinessService.addRelevanceArtist(params, function(data){
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 2000);
        that.toastService.toast(toastCfg);
        that.activeModal.close("ok");
        });

  }
  close(): void {
    this.activeModal.dismiss({ status: 'closed' });
  }
}
