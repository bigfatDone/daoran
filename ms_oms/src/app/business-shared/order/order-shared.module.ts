import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationModule} from '../../shared/pagination/pagination.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

import { RuleSaveComponent } from './rule-save.component';
import { RuleIssuedComponent } from './rule-Issued.component';
import { ProductSaveComponent } from './product-save.component';
// import { PictureSaveComponent } from './picture-save.component';

import { ProgramBusinessService } from '../../business-service/program/program-business.service';
import { OrderBusinessService } from '../../business-service/order/order-business.service';
import {RurelateSaveComponent} from './rurelate-save.component';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import {TapeSaveComponent} from './tape-save.component';
import {ActiveSaveComponent} from './active-save.component';
import {AlbumSaveComponent} from './album-save.component';
import {ConfigSaveComponent} from './config-save.component';
import {PictureSaveComponent} from './picture-save.component';
import {PictureShowComponent} from './picture-show.component';
import {OnceUploadComponent} from './once-upload.component';

/**
 * 订购管理共享模块
 */
@NgModule({
  imports:      [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    CustomScrollbarModule,
    MultiselectDropdownModule,
  ],
  declarations: [
    RuleSaveComponent,
    ProductSaveComponent,
    RuleIssuedComponent,
    RurelateSaveComponent,
    TapeSaveComponent,
    ActiveSaveComponent,
    AlbumSaveComponent,
    ConfigSaveComponent,
    PictureSaveComponent,
    PictureShowComponent,
    OnceUploadComponent,

  ],

  entryComponents: [RuleSaveComponent, ProductSaveComponent,  RuleIssuedComponent, RurelateSaveComponent, TapeSaveComponent, ActiveSaveComponent, AlbumSaveComponent, ConfigSaveComponent, PictureSaveComponent, PictureShowComponent, OnceUploadComponent],

  exports:      [],
  providers:    [
    OrderBusinessService, ProgramBusinessService
  ]
})
export class OrderSharedModule {

}
