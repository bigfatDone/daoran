import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipeModule } from '../../pipe/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import { HistoryListComponent } from '../../business-shared/history/history-list.component';
import { HistorySharedModule } from '../../business-shared/history/history-shared.module';
import {PictureListComponent} from '../../business-shared/history/picture-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HistoryRoutingModule,
    HistorySharedModule,
    CPaginationModule,
    PipeModule
  ],
  declarations: [
    HistoryComponent,
    HistoryListComponent,
    PictureListComponent,
  ],
  exports: [
  ],
  providers: []
})

export class HistoryModule { }
