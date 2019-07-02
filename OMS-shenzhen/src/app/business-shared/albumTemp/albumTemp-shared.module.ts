import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ImgCropperSelectModule} from '../../shared/img-cropper-select/img-cropper-select.module';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

import { AlbumTempSaveComponent } from './albumTemp-save.component';
import {AlbumTempBusinessService} from '../../business-service/albumTemp/albumTemp-business.service';
import {ElementSaveComponent} from './element-save.component';
import { PageBusinessService } from '../../business-service/page/page-business.service';


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
    CPaginationModule,
    CustomScrollbarModule,
  ],
  declarations: [
    AlbumTempSaveComponent,
    ElementSaveComponent,
  ],
  entryComponents: [AlbumTempSaveComponent, ElementSaveComponent,],
  exports:      [],
  providers:    [
    AlbumTempBusinessService,
    PageBusinessService
  ]
})
export class AlbumTempSharedModule {

}
