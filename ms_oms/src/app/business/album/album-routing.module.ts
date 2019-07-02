import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumComponent } from './album.component';
import { AlbumListComponent } from '../../business-shared/album/album-list.component';


const albumRoutes: Routes = [
  {
    path: '',
    component: AlbumComponent,
    children: [
      {
        path: 'albumList',
        component: AlbumListComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(albumRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AlbumRoutingModule { }
