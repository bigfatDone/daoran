import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GatewayComponent } from './gateway.component';
import { GatewayListComponent } from '../../business-shared/gateway/gateway-list.component';
import {SqllogListComponent} from '../../business-shared/gateway/sqllog-list.component';

const gatewayRoutes: Routes = [
  {
    path: '',
    component: GatewayComponent,
    children: [
      {
        path: 'gatewayList',
        component: GatewayListComponent
      },
      {
        path: 'sqllogList',
        component: SqllogListComponent
      }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(gatewayRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class GatewayRoutingModule { }
