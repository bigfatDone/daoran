import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ImgCropperSelectModule} from '../../shared/img-cropper-select/img-cropper-select.module';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';
import {MessageSaveComponent} from './message-save.component';
import {MessageSeeComponent} from './message-see.component';
import {RecordSeeComponent} from './record-see.component';



/**
 * 资源共享模块
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
    MessageSaveComponent,
    MessageSeeComponent,
    RecordSeeComponent
  ],
  entryComponents: [
    MessageSaveComponent,
    MessageSeeComponent,
    RecordSeeComponent
  ],
  exports:      [],
  providers:    [
    MessageSharedModule,
  ]
})
export class MessageSharedModule {

}
