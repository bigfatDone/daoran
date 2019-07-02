import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { MessageRoutingModule } from './message-routing.module';
import { MessageComponent } from './message.component';
import { MessageListComponent } from '../../business-shared/message/message-list.component';
import { FeedbackListComponent } from '../../business-shared/message/feedback-list.component';
import { MessageSharedModule } from '../../business-shared/message/message-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessageRoutingModule,
    CPaginationModule,
    MessageSharedModule
  ],
  declarations: [
    MessageComponent,
    MessageListComponent,
    FeedbackListComponent
  ],
  exports: [
  ],
  providers: []
})

export class MessageModule {}
