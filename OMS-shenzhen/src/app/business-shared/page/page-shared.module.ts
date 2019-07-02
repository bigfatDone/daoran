import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ImgCropperSelectModule} from '../../shared/img-cropper-select/img-cropper-select.module';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { ElementSaveComponent } from './element-save.component';
import { ElementPageCheckComponent } from './element-page-check.component';
import { ElementVlistCheckComponent } from './element-vlist-check.component';
import { ElementArtlistCheckComponent } from './element-artlist-check.component';
import { ElementSingleResCheckComponent } from './element-singleRes-check.component';
import { ElementUploadImgComponent } from './element-uploadImg.component';

import { ProductSaveComponent } from './product-save.component';
import { PageImgshowComponent } from './page-imgshow.component';

import { PageBusinessService } from '../../business-service/page/page-business.service';
import { CommonBusinessService } from '../../business-service/common/common-business.service';
import {PageSaveComponent} from './page-save.component';
import {PageEditComponent} from './page-edit.component';
import { FileUploadModule } from 'ng2-file-upload';
import { PipeModule } from '../../pipe/pipe.module';
import {PageCopyComponent} from './page-copy.component';
import {PageAddrelationComponent} from './page-addrelation.component';
import {pageResSelectComponent} from './page-res-select.component';
import {ElementConfirSaveComponent} from './element-confirSave.component';
import {ElementConfirRelateComponent} from './element-confirRelate.component';

import {ElementEditPreinstall} from './element-editPreinstall.component';
import {ElementwallCheckComponent} from './element-wall-check.component';
import {ElementAlbumCheckComponent} from './element-album-check.component';
import {ElementAgainImgComponent} from './element-againImg.component';
import {ElementTagCheckComponent} from './element-tag-check.component';
import {ElementTagProgramComponent} from './element-tag-program.component';
import {PageUniteComponent} from './page-unite.component';
import {ElementConfirPicComponent} from './element-confirPic.component';
import {PageUnionComponent} from './page-union.component';
import {AlbumTempSaveComponent} from './albumTemp-save.component';


/**
 * 节目单共享模块
 */
@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    ImgCropperSelectModule,
    CPaginationModule,
    CustomScrollbarModule,
    PipeModule,
    MultiselectDropdownModule
  ],
  declarations: [
    ElementSaveComponent,
    ElementPageCheckComponent,
    ElementVlistCheckComponent,
    ElementArtlistCheckComponent,
    PageSaveComponent,
    PageEditComponent,
    ElementUploadImgComponent,
    ProductSaveComponent,
    PageCopyComponent,
    PageImgshowComponent,
    ElementSingleResCheckComponent,
    PageAddrelationComponent,
    pageResSelectComponent,
    ElementConfirSaveComponent,
    ElementConfirRelateComponent,
    ElementEditPreinstall,
    ElementwallCheckComponent,
    ElementAlbumCheckComponent,
    ElementAgainImgComponent,
    ElementTagCheckComponent,
    ElementTagProgramComponent,
    PageUniteComponent,
    ElementConfirPicComponent,
    PageUnionComponent,
    AlbumTempSaveComponent,
  ],
  entryComponents: [ElementSaveComponent, ElementPageCheckComponent, ElementVlistCheckComponent, ElementArtlistCheckComponent, PageSaveComponent, PageEditComponent , PageCopyComponent, ElementUploadImgComponent, ProductSaveComponent, PageImgshowComponent, ElementSingleResCheckComponent, PageAddrelationComponent, pageResSelectComponent , ElementConfirSaveComponent, ElementConfirRelateComponent, ElementEditPreinstall, ElementwallCheckComponent, ElementAlbumCheckComponent,
    ElementAgainImgComponent, ElementTagCheckComponent, ElementTagProgramComponent, PageUniteComponent, ElementConfirPicComponent, PageUnionComponent, AlbumTempSaveComponent,
  ],
  exports:      [ElementPageCheckComponent, ElementVlistCheckComponent, ElementSingleResCheckComponent, ElementArtlistCheckComponent, ElementwallCheckComponent, ElementAlbumCheckComponent, ElementTagCheckComponent,],
  providers:    [
    PageBusinessService,
    CommonBusinessService
  ]
})
export class PageSharedModule {

}
