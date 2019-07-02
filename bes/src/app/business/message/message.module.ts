import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
import { MessageRoutingModule } from './message-routing.module';
import { MessageComponent } from './message.component';
import { MessageListComponent } from '../../business-shared/message/message-list.component';
import { RecordListComponent } from '../../business-shared/message/record-list.component';
// import { MessageDetailComponent } from '../../business-shared/message/message-detail.component';
import { PipeModule } from '../../pipe/pipe.module';
import { MessageBusinessService } from '../../business-service/message/message-business.service';
import {MessageSharedModule} from '../../business-shared/message/message-shared.module';
import {CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

@NgModule({
  imports: [
    CommonModule, FormsModule, NgbModule, MessageRoutingModule,CustomScrollbarModule, CPaginationModule, PipeModule, MessageSharedModule
  ],
  declarations: [
    MessageComponent, MessageListComponent, RecordListComponent
  ],
  exports: [
  ],
  providers: [MessageBusinessService]
})

export class MessageModule { }
