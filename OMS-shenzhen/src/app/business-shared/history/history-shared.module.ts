import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ImgCropperSelectModule} from '../../shared/img-cropper-select/img-cropper-select.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

import { HistoryBusinessService } from '../../business-service/history/history-business.service';
import { PipeModule } from '../../pipe/pipe.module';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import {PictureAddComponent} from './picture-add.component';
import {PictureInfoComponent} from './picture-info.component';
import { HistoryDetailComponent} from './history-detail.component';
import { ImgshowComponent } from './imgshow.component';

/**
 * 历史运营元素管理
 */
@NgModule({
  imports:      [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    ImgCropperSelectModule,
    CustomScrollbarModule,
    PipeModule,
    CPaginationModule,
    // PageImgshowComponent
  ],
  declarations: [
    PictureAddComponent,
    PictureInfoComponent,
    HistoryDetailComponent,
    ImgshowComponent,
  ],
  entryComponents: [
    PictureAddComponent,
    PictureInfoComponent,
    HistoryDetailComponent,
    ImgshowComponent,
  ],
  exports:      [],
  providers:    [
    HistoryBusinessService
  ]
})
export class HistorySharedModule {

}
