import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MessageComponent } from './message.component';
import { MessageListComponent } from '../../business-shared/message/message-list.component';
import { RecordListComponent } from '../../business-shared/message/record-list.component';
// import { ArtistsDetailComponent } from '../../business-shared/artists/artists-detail.component';

const messageRoutes: Routes = [
  {
    path: '',
    component: MessageComponent,
    children: [
      {
        path: 'messageList',
        component: MessageListComponent,
      },
      {
        path: 'recordList',
        component: RecordListComponent,
      }
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
