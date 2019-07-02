import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlbumTempComponent } from './albumTemp.component';
import {AlbumTempConfigComponent} from '../../business-shared/albumTemp/albumTemp-config.component';

const albumTempRoutes: Routes = [
  {
    path: '',
    component: AlbumTempComponent,
    children: [
      {
        path: 'albumTempConfig',
        component: AlbumTempConfigComponent
      },
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(albumTempRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AlbumTempRoutingModule { }
