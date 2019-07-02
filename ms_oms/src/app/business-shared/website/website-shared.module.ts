import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ImgCropperSelectModule} from '../../shared/img-cropper-select/img-cropper-select.module';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

import { ArticleSaveComponent } from './article-save.component';
import { BannerSaveComponent } from './banner-save.component';
import {WebsiteBusinessService} from '../../business-service/website/website-business.service';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import {MessageSeeComponent} from './message-see.component';
import {BannerImgshowComponent} from './banner-imgshow.component';


/**
 * 节目单共享模块
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
  ],
  declarations: [
    ArticleSaveComponent,
    BannerSaveComponent,
    MessageSeeComponent,
    BannerImgshowComponent
  ],
  entryComponents: [ArticleSaveComponent, BannerSaveComponent,  MessageSeeComponent, BannerImgshowComponent],
  exports:      [],
  providers:    [
    WebsiteBusinessService,
    CommonBusinessService
  ]
})
export class WebsiteSharedModule {

}
