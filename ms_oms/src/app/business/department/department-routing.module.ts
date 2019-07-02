import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DepartmentComponent } from './department.component';
import { DepartmentListComponent } from '../../business-shared/department/department-list.component';
import { PowerListComponent } from '../../business-shared/department/power-list.component';

const departmentRoutes: Routes = [
  {
    path: '', component: DepartmentComponent,
    children: [
      {
        path: 'departmentList',
        component: DepartmentListComponent
      },
      {
        path: 'powerList',
        component: PowerListComponent
      }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(departmentRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DepartmentRoutingModule { }
