import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ImgCropperSelectModule} from '../../shared/img-cropper-select/img-cropper-select.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

import { PictureBusinessService } from '../../business-service/picture/picture-business.service';
import { PipeModule } from '../../pipe/pipe.module';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { PctureFuncComponent} from './picture-func.component';
import { PctureUploadingComponent} from './picture-uploading.component';

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
  ],
  declarations: [
    PctureFuncComponent,
    PctureUploadingComponent,
  ],
  entryComponents: [
    PctureFuncComponent,
    PctureUploadingComponent,
  ],
  exports:      [],
  providers:    [
    PictureBusinessService
  ]
})
export class PictureSharedModule {

}
