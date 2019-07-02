import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationModule} from '../../shared/pagination/pagination.module';

import { DrawRoutingModule } from './draw-routing.module';
import { DrawComponent } from './draw.component';
import { PageModule } from '../page/page.module';
import { ProgramModule } from '../../business/program/program.module';
import {EntryModule} from '../entry/entry.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DrawRoutingModule,
    ProgramModule,
    PageModule,
    EntryModule,
    PaginationModule
  ],
  declarations: [
    DrawComponent,
  ],
  exports: [
  ],
  providers: []
})

export class DrawModule { }
