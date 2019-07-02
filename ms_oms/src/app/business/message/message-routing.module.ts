import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MessageComponent } from './message.component';
import { FeedbackListComponent } from '../../business-shared/message/feedback-list.component';
import { MessageListComponent } from '../../business-shared/message/message-list.component';

const messageRoutes: Routes = [
  {
    path: '',
    component: MessageComponent,
    children: [
      {
        path: 'messageList',
        component: MessageListComponent
      },
      {
        path: 'feedbackList',
        component: FeedbackListComponent
      },
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(messageRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MessageRoutingModule { }
