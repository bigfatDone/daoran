import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderComponent } from './order.component';
import { RuleListComponent } from '../../business-shared/order/rule-list.component';
import { ProductListComponent } from '../../business-shared/order/product-list.component';
import { RurelateListComponent } from '../../business-shared/order/rurelate-list.component';
import {TapeListComponent} from '../../business-shared/order/tape-list.component';
import {ActiveListComponent} from '../../business-shared/order/active-list.component';
import {AlbumListComponent} from '../../business-shared/order/album-list.component';
import {ConfigListComponent} from '../../business-shared/order/config-list.component';
import { PictureListComponent } from '../../business-shared/order/picture-list.component';

const orderRoutes: Routes = [
  {
    path: '',
    component: OrderComponent,
    children: [
      {
        path: 'ruleList',
        component: RuleListComponent
      },
      {
        path: 'productList',
        component: ProductListComponent
      },
      {
        path: 'rurelateList',
        component: RurelateListComponent
      },
      {
        path: 'tapeList',
        component: TapeListComponent
      },
      {
        path: 'activeList',
        component: ActiveListComponent
      },
      {
        path: 'albumList',
        component: AlbumListComponent
      },
      {
        path: 'configList',
        component: ConfigListComponent
      },
      {
        path: 'pictureList',
        component: PictureListComponent
      }
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
export class OrderRoutingModule { }
