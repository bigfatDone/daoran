import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { AlbumRoutingModule } from './album-routing.module';
import { AlbumComponent } from './album.component';
import { AlbumListComponent } from '../../business-shared/album/album-list.component';
import { AlbumSharedModule } from '../../business-shared/album/album-shared.module';
import { ProgramSharedModule } from '../../business-shared/program/program-shared.module';
import { PipeModule } from '../../pipe/pipe.module';
import {DropDownComponentModule} from '../../shared/drop-down/drop-down.module';

@NgModule({
  imports: [
    CommonModule,
    AlbumRoutingModule,
    FormsModule,
    CPaginationModule,
    AlbumSharedModule,
    ProgramSharedModule,
    PipeModule,
    DropDownComponentModule
  ],
  declarations: [
    AlbumComponent,
    AlbumListComponent,
  ]
})
export class AlbumModule { }
