import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HistoryComponent } from './history.component';
import { HistoryListComponent } from '../../business-shared/history/history-list.component';
import {PictureListComponent} from '../../business-shared/history/picture-list.component';

const historyRoutes: Routes = [
  {
    path: '',
    component: HistoryComponent,
    children: [
      {
        path: 'historyList',
        component: HistoryListComponent
      },{
        path: 'pictureList',
        component: PictureListComponent
      }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(historyRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HistoryRoutingModule { }
