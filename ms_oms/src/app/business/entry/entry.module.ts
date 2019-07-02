import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule } from '../../shared/c-pagination/c-pagination.module';

import { EntryRoutingModule } from './entry-routing.module';
import { EntryComponent } from './entry.component';
import { VisitListComponent } from '../../business-shared/entry/visit-list.component';
import { ObjverListComponent } from '../../business-shared/entry/objver-list.component';
import { ProjectListComponent } from '../../business-shared/entry/project-list.component';
import { RelateListComponent } from '../../business-shared/entry/relate-list.component';
import { EntrySharedModule } from '../../business-shared/entry/entry-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EntryRoutingModule,
    EntrySharedModule,
    CPaginationModule
  ],
  declarations: [
    EntryComponent,
    VisitListComponent,
    ObjverListComponent,
    ProjectListComponent,
    RelateListComponent,
  ],
  exports: [
  ],
  providers: []
})

export class EntryModule { }
