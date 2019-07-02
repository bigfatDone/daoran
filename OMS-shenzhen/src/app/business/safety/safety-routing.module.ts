import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SafetyComponent } from './safety.component';
import { DealerListComponent } from '../../business-shared/safety/dealer-list.component';
import { InterfaceListComponent } from '../../business-shared/safety/interface-list.component';
import { RoleListComponent } from '../../business-shared/safety/role-list.component';
const orderRoutes: Routes = [
  {
    path: '',
    component: SafetyComponent,
    children: [
      {
        path: 'dealerList',
        component: DealerListComponent
      },
      {
        path: 'interfaceList',
        component: InterfaceListComponent
      },
      {
        path: 'roleList',
        component: RoleListComponent
      },
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(orderRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SafetyRoutingModule { }
