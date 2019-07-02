import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArtistsComponent } from './artists.component';
import { ArtistsListComponent } from '../../business-shared/artists/artists-list.component';
import { ArtistsDetailComponent } from '../../business-shared/artists/artists-detail.component';

const artistsRoutes: Routes = [
  {
    path: '',
    component: ArtistsComponent,
    children: [
      {
        path: 'artistsList',
        component: ArtistsListComponent,
      },
      {
        path: 'artistsDetail/:id',
        component: ArtistsDetailComponent,
      }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(artistsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ArtistsRoutingModule { }
