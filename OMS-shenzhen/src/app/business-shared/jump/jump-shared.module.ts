import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ImgCropperSelectModule} from '../../shared/img-cropper-select/img-cropper-select.module';
// import { PaginationModule} from '../../shared/pagination/pagination.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

import { JumpSaveComponent } from './jump-save.component';
import { operatingElementCheckComponent } from './operating-element-check.component';
import { operatingAccessidCheckComponent } from './operating-accessid-check.component';

import { JumpBusinessService } from '../../business-service/jump/jump-business.service';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { PipeModule } from '../../pipe/pipe.module';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

/**
 * 产品跳转管理模块
 */
@NgModule({
  imports:      [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    ImgCropperSelectModule,
    // PaginationModule,
    CustomScrollbarModule,
    MultiselectDropdownModule,
    PipeModule,
    CPaginationModule
  ],
  declarations: [
    JumpSaveComponent,
    operatingElementCheckComponent,
    operatingAccessidCheckComponent
  ],
  entryComponents: [
    JumpSaveComponent,
    operatingElementCheckComponent,
    operatingAccessidCheckComponent
  ],
  exports:      [],
  providers:    [
    JumpBusinessService
  ]
})
export class JumpSharedModule {

}
