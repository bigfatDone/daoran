import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { UserListComponent } from '../../business-shared/user/user-list.component';
import {SysListComponent} from '../../business-shared/user/sys-list.component';

const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'userList',
        component: UserListComponent
      },
      {
        path: 'sysList',
        component: SysListComponent
      }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class UserRoutingModule { }
