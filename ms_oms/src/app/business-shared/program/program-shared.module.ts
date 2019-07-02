import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProgramAddComponent} from './program-add.component';
import { ProgramIntoComponent} from './program-into.component';

import { ProgramBusinessService} from '../../business-service/program/program-business.service';
import {CommonBusinessService} from '../../business-service/common/common-business.service';
import { PipeModule } from '../../pipe/pipe.module';

import { CPaginationModule } from '../../shared/c-pagination/c-pagination.module';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { CustomScrollbarModule } from '../../shared/custom-scrollbar/custom-scrollbar.module';
import {ProgramUploadComponent} from './program-upload.component';
import {ProgramConfirSaveComponent} from './program-confirSave.component';

import { HttpClientModule } from '@angular/common/http';
import {DropDownComponentModule} from '../../shared/drop-down/drop-down.module';

/**
 * 节目单共享模块
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
    HttpClientModule,
    DropDownComponentModule
  ],
  declarations: [
    ProgramAddComponent,
    ProgramIntoComponent,
    ProgramUploadComponent,
    ProgramConfirSaveComponent,
  ],
  entryComponents: [ProgramAddComponent, ProgramIntoComponent, ProgramUploadComponent, ProgramConfirSaveComponent],
  exports:      [],
  providers:    [
    ProgramBusinessService, CommonBusinessService
  ]
})
export class ProgramSharedModule {
}
