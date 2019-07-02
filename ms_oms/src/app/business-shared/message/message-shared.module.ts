import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ImgCropperSelectModule} from '../../shared/img-cropper-select/img-cropper-select.module';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';
import {FeedbackSaveComponent} from './feedback-save.component';
import {MessageBusinessService} from '../../business-service/message/message-business.service';


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
  declarations: [FeedbackSaveComponent
  ],
  entryComponents: [FeedbackSaveComponent],
  exports:      [],
  providers:    [
    MessageBusinessService
  ]
})
export class MessageSharedModule {
}
