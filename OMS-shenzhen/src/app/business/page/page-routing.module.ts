import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent } from './page.component';
import { ElementListComponent } from '../../business-shared/page/element-list.component';
import { PageListComponent } from '../../business-shared/page/page-list.component';
import { ProductListComponent } from '../../business-shared/page/product-list.component';
import { AlbumTempListComponent } from '../../business-shared/page/albumTemp-list.component';

const pageRoutes: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      {
        path: 'elementList',
        component: ElementListComponent
      },
      {
        path: 'pageList',
        component: PageListComponent
      },
      {
        path: 'productList',
        component: ProductListComponent
      },
      {
        path: 'albumTempList',
        component: AlbumTempListComponent
      }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(pageRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PageRoutingModule { }
