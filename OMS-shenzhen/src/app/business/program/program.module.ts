import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { ProgramRoutingModule } from './program-routing.module';
import { ProgramComponent } from './program.component';
import { ProgramListComponent } from '../../business-shared/program/program-list.component';
import { ProgramSharedModule } from '../../business-shared/program/program-shared.module';
import { PipeModule } from '../../pipe/pipe.module';
import {DropDownComponentModule} from '../../shared/drop-down/drop-down.module';
@NgModule({
  imports: [
    CommonModule,
    ProgramRoutingModule,
    FormsModule,
    CPaginationModule,
    ProgramSharedModule,
    PipeModule,
    DropDownComponentModule
  ],
  declarations: [
    ProgramComponent,
    ProgramListComponent,
  ]
})
export class ProgramModule { }
