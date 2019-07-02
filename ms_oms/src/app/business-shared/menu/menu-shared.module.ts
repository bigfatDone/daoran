import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ImgCropperSelectModule} from '../../shared/img-cropper-select/img-cropper-select.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';
import { MenuSaveComponent} from './menu-save.component';

@NgModule({
  imports:      [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    ImgCropperSelectModule,
    CustomScrollbarModule
  ],
  declarations: [
    MenuSaveComponent
  ],
  entryComponents: [MenuSaveComponent],
  exports:      [],
  providers:    []
})
export class MenuSharedModule {
}
