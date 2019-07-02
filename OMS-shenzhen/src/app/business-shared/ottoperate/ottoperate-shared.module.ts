import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ImgCropperSelectModule} from '../../shared/img-cropper-select/img-cropper-select.module';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

import { VersionSaveComponent } from './version-save.component';
import {OttoperateBusinessService} from '../../business-service/ottoperate/ottoperate-business.service';
import {VerapkSaveComponent} from './verapk-save.component';
import {OperateSaveComponent} from './operate-save.component';
import {ElementSaveComponent} from './element-save.component';
import {ElementCheckComponent} from './element-check.component';
import {PipeModule} from '../../pipe/pipe.module';
// import {CommonBusinessService} from '../../business-service/common/common-business.service';


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
    PipeModule
  ],
  declarations: [
    VersionSaveComponent, VerapkSaveComponent, OperateSaveComponent, ElementSaveComponent, ElementCheckComponent
  ],
  entryComponents: [VersionSaveComponent, VerapkSaveComponent, OperateSaveComponent, ElementSaveComponent, ElementCheckComponent],
  exports:      [],
  providers:    [
    OttoperateBusinessService,
  ]
})
export class OttoperateSharedModule {

}
