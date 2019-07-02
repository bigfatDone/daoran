import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ImgCropperSelectModule} from '../../shared/img-cropper-select/img-cropper-select.module';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';
import {ArtistsDetailComponent} from './artists-detail.component';
import {ArtistsDeriveComponent} from './artists-derive.component';



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
    ArtistsDetailComponent,
    ArtistsDeriveComponent
  ],
  entryComponents: [
    ArtistsDetailComponent,
    ArtistsDeriveComponent
  ],
  exports:      [],
  providers:    [
    ArtistsSharedModule,
  ]
})
export class ArtistsSharedModule {

}
