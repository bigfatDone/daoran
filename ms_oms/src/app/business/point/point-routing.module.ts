import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PointComponent } from './point.component';
import { RelateListComponent } from '../../business-shared/point/relate-list.component';
import {ItemBesListComponent} from '../../business-shared/point/itemBes-list.component';
import {NodeBesListComponent} from '../../business-shared/point/nodeBes-list.component';
import {RelateBesListComponent} from '../../business-shared/point/relateBes-list.component';
import {ProjectListComponent} from '../../business-shared/point/project-list.component';

const pointRoutes: Routes = [
  {
    path: '',
    component: PointComponent,
    children: [
      {
        path: 'relateList',
        component: RelateListComponent
      },
      {
        path: 'itemBesList',
        component: ItemBesListComponent
      },
      {
        path: 'nodeBesList',
        component: NodeBesListComponent
      },
      {
        path: 'relateBesList',
        component: RelateBesListComponent
      },
      {
        path: 'projectPriList',
        component: ProjectListComponent
      },
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(pointRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PointRoutingModule { }
