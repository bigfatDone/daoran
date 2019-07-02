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
import {MarkSaveComponent} from './mark-manage/mark-save.component';
import { MarkTabListComponent } from './mark-manage/mark-tab-list/mark-tab-list.component';
import {ElementCourseComponent} from './element-course.component';
import {TrainingListSaveComponent} from './training-manage/training-list-save.component';
import {AddCourseComponent} from './training-manage/add-course.component';
import {CourseListComponent} from './training-manage/course-list.component';
import {CourseUploadComponent} from './training-manage/course-upload.component';
import {TemplateListComponent} from './template-manage/template-list.component';
import {AddTemplateComponent} from './template-manage/template-add.component';
import {TemplateConfigComponent} from './template-manage/template-config.component';
import {TemplateAComponent} from './template-manage/templateType/template-a.component';
import {TemplateBComponent} from './template-manage/templateType/template-b.component';
import {TemplateCComponent} from './template-manage/templateType/template-c.component';
import {TemplateDComponent} from './template-manage/templateType/template-d.component';
import {TemplateEComponent} from './template-manage/templateType/template-e.component';
import {PageConfigComponent} from './template-manage/page-config.component';
import {PageConfigAddComponent} from './template-manage/page-config-add.component';
import {OttoperateSharedModule} from '../ottoperate/ottoperate-shared.module';
import {DropDownComponentModule} from '../../shared/drop-down/drop-down.module';
import {PageConfigCopyComponent} from './template-manage/page-config-copy.component';
import {PageTOComponent} from './template-manage/page-to.component';
import {CarouselComponent} from './template-manage/template-district/carousel.component';
import {FloorComponent} from './template-manage/template-district/floor.component';
import {VideoComponent} from './template-manage/template-district/video.component';
import {AnnouncementComponent} from './template-manage/template-district/announcement.component';
import {AddDistrictComponent} from './template-manage/add-district.component';
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
    MultiselectDropdownModule,
    OttoperateSharedModule,
    DropDownComponentModule
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
    MarkSaveComponent,
    MarkTabListComponent,
    ElementCourseComponent,
    TrainingListSaveComponent,
    AddCourseComponent,
    CourseListComponent,
    CourseUploadComponent,
    TemplateListComponent,
    AddTemplateComponent,
    TemplateConfigComponent,
    TemplateAComponent,
    TemplateBComponent,
    TemplateCComponent,
    TemplateDComponent,
    TemplateEComponent,
    PageConfigComponent,
    PageConfigAddComponent,
    PageConfigCopyComponent,
    PageTOComponent,
    CarouselComponent,
    AddDistrictComponent,
    VideoComponent,
    AnnouncementComponent,
    FloorComponent
  ],
  entryComponents: [ElementSaveComponent, ElementPageCheckComponent, ElementVlistCheckComponent, ElementArtlistCheckComponent, PageSaveComponent, PageEditComponent , PageCopyComponent, ElementUploadImgComponent, ProductSaveComponent, PageImgshowComponent, ElementSingleResCheckComponent, PageAddrelationComponent, pageResSelectComponent , ElementConfirSaveComponent, ElementConfirRelateComponent, ElementEditPreinstall, ElementwallCheckComponent, ElementAlbumCheckComponent, ElementAgainImgComponent, ElementTagCheckComponent, ElementTagProgramComponent, PageUniteComponent, ElementConfirPicComponent, PageUnionComponent, AlbumTempSaveComponent, MarkSaveComponent,
    MarkTabListComponent, ElementCourseComponent, TrainingListSaveComponent, AddCourseComponent, CourseListComponent, CourseUploadComponent, TemplateListComponent, AddTemplateComponent, TemplateConfigComponent, TemplateAComponent, TemplateBComponent, TemplateCComponent, TemplateDComponent, TemplateEComponent, PageConfigComponent, PageConfigAddComponent, PageConfigCopyComponent, PageTOComponent, CarouselComponent, AddDistrictComponent, VideoComponent, AnnouncementComponent, FloorComponent
  ],
  exports:      [ElementPageCheckComponent, ElementVlistCheckComponent, ElementSingleResCheckComponent, ElementArtlistCheckComponent, ElementwallCheckComponent, ElementAlbumCheckComponent, ElementTagCheckComponent, TrainingListSaveComponent, AddCourseComponent, CourseListComponent, CourseUploadComponent, TemplateListComponent, AddTemplateComponent, TemplateConfigComponent, TemplateAComponent, TemplateBComponent, TemplateCComponent, TemplateDComponent, TemplateEComponent, PageConfigComponent, PageConfigAddComponent, PageConfigCopyComponent, PageTOComponent, CarouselComponent, AddDistrictComponent, VideoComponent, AnnouncementComponent, FloorComponent],
  providers:    [
    PageBusinessService,
    CommonBusinessService
  ]
})
export class PageSharedModule {

}
