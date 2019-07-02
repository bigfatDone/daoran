import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EntryComponent } from './entry.component';
import { VisitListComponent } from '../../business-shared/entry/visit-list.component';
import { ObjverListComponent } from '../../business-shared/entry/objver-list.component';
import { ProjectListComponent } from '../../business-shared/entry/project-list.component';
import { RelateListComponent } from '../../business-shared/entry/relate-list.component';

const entryRoutes: Routes = [
  {
    path: '',
    component: EntryComponent,
    children: [
      {
        path: 'visitList',
        component: VisitListComponent
      },
      {
        path: 'objverList',
        component: ObjverListComponent
      },
      {
        path: 'projectList',
        component: ProjectListComponent
      },
      {
        path: 'relateList',
        component: RelateListComponent
      }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(entryRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class EntryRoutingModule { }
