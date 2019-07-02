import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { DepartmentRoutingModule } from './department-routing.module';
import {DepartmentComponent} from './department.component';
import {DepartmentListComponent} from '../../business-shared/department/department-list.component';
import {PowerListComponent} from '../../business-shared/department/power-list.component';
import { DepartmentSharedModule } from '../../business-shared/department/department-shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    CPaginationModule,
    DepartmentRoutingModule,
    DepartmentSharedModule,
  ],
  declarations: [
    DepartmentComponent,
    DepartmentListComponent,
    PowerListComponent
  ]
})

export class DepartmentModule { }
