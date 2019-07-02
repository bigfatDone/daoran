import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveComponent } from './active.component';
import { ActiveListComponent } from '../../business-shared/active/active-list.component';
import { AwardListComponent } from '../../business-shared/active/award-list.component';
import { ProductListComponent } from '../../business-shared/active/product-list.component';
import { RelateListComponent } from '../../business-shared/active/relate-list.component';
import {ActRecordListComponent} from '../../business-shared/active/actRecord-list.component';
import {UserActivityListComponent} from '../../business-shared/active/userActivity-list.component';
import {RedPacketListComponent} from '../../business-shared/active/redPacket-list.component';
import {OrderInfoListComponent} from '../../business-shared/active/orderInfo-list.component';


const activeRoutes: Routes = [
  {
    path: '',
    component: ActiveComponent,
    children: [
      {
        path: 'activeList',
        component: ActiveListComponent
      },
      {
        path: 'awardList',
        component: AwardListComponent
      },
      {
        path: 'productList',
        component: ProductListComponent
      },
      {
        path: 'relateList',
        component: RelateListComponent
      },
      {
        path: 'activeRecordList',
        component: ActRecordListComponent
      },
      {
        path: 'userActivityList',
        component: UserActivityListComponent
      },
      {
        path: 'redPacketList',
        component: RedPacketListComponent
      },
      {
        path: 'orderInfoList',
        component: OrderInfoListComponent
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(activeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ActiveRoutingModule { }
