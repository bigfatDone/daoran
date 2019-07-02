import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

import { VisitSaveComponent } from './visit-save.component';
import { ObjverSaveComponent } from './objver-save.component';
import { ProjectSaveComponent } from './project-save.component';
import { RelateSaveComponent } from './relate-save.component';
import { VisitDetailsComponent } from './visit-details.component';
import { AddEntryKindComponent } from './add-entry-kind.component';
import { AddEntryKindvalueComponent } from './add-entry-kindvalue.component';

import { EntryBusinessService } from '../../business-service/entry/entry-business.service';


/**
 * 入口共享模块
 */
@NgModule({
  imports:      [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomScrollbarModule
  ],
  declarations: [
    VisitSaveComponent,
    ObjverSaveComponent,
    ProjectSaveComponent,
    RelateSaveComponent,
    VisitDetailsComponent,
    AddEntryKindComponent,
    AddEntryKindvalueComponent
  ],
  entryComponents: [VisitSaveComponent, ObjverSaveComponent, ProjectSaveComponent, RelateSaveComponent, VisitDetailsComponent, AddEntryKindComponent, AddEntryKindvalueComponent],
  exports:      [],
  providers:    [
    EntryBusinessService
  ]
})
export class EntrySharedModule {

}
