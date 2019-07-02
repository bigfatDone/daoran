import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PictureComponent } from './picture.component';
import { PictureManagementComponent } from '../../business-shared/picture/picture-management.component';

const pictureRoutes: Routes = [
  {
    path: '',
    component: PictureComponent,
    children: [
      {
        path: 'pictureManagement',
        component: PictureManagementComponent
      }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(pictureRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PictureRoutingModule { }
