import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import { ProgramAddComponent} from './program-add.component';
// import { ProgramIntoComponent} from './program-into.component';

import { AlbumBusinessService} from '../../business-service/album/album-business.service';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import { PipeModule } from '../../pipe/pipe.module';

import { CPaginationModule } from '../../shared/c-pagination/c-pagination.module';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { CustomScrollbarModule } from '../../shared/custom-scrollbar/custom-scrollbar.module';
import {AlbumAddComponent} from './album-add.component';
import {ArtistIntoComponent} from './artist-into.component';
import {AlbumIntoComponent} from './album-into.component';
import {AlbumConfirSaveComponent} from './album-confirSave.component';
import {AlbumUploadComponent} from './album-upload.component';
// import {ProgramUploadComponent} from './program-upload.component';
// import {ProgramConfirSaveComponent} from './program-confirSave.component';
import {DropDownComponentModule} from '../../shared/drop-down/drop-down.module';

/**
 * 专辑管理共享模块
 */
@NgModule({
  imports:      [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    CPaginationModule,
    CustomScrollbarModule,
    MultiselectDropdownModule,
    DropDownComponentModule
  ],
  declarations: [
    AlbumAddComponent,
    ArtistIntoComponent,
    AlbumIntoComponent,
    AlbumConfirSaveComponent,
    AlbumUploadComponent,
  ],
  entryComponents: [
    AlbumAddComponent,
    ArtistIntoComponent,
    AlbumIntoComponent,
    AlbumConfirSaveComponent,
    AlbumUploadComponent
  ],
  exports:      [],
  providers:    [
    AlbumBusinessService, CommonBusinessService
  ]
})
export class AlbumSharedModule {
}
