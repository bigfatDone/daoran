import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DrawComponent } from './draw.component';
import { ProgramListComponent } from '../../business-shared/program/program-list.component';
import {ElementListComponent} from '../../business-shared/page/element-list.component';
import { PageListComponent } from  '../../business-shared/page/page-list.component';
import {ProductListComponent} from  '../../business-shared/page/product-list.component';
import { VisitListComponent } from '../../business-shared/entry/visit-list.component';
const drawRoutes: Routes = [
  {
    path: '',
    component: DrawComponent,
    children: [
      {
        path: 'programList',
        component: ProgramListComponent
      }, {
        path: 'elementList',
        component: ElementListComponent
      },
      {
        path: 'pageList',
        component: PageListComponent
      }, {
        path: 'productList',
        component: ProductListComponent
      }, {
        path: 'entryList',
        component: VisitListComponent
      }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(drawRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DrawRoutingModule { }
