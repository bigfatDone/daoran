import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JumpComponent } from './jump.component';
import { JumpListComponent } from '../../business-shared/jump/jump-list.component';

const jumpRoutes: Routes = [
  {
    path: '',
    component: JumpComponent,
    children: [
      {
        path: 'jumpList',
        component: JumpListComponent
      }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(jumpRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class JumpRoutingModule { }
