import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { PointRoutingModule } from './point-routing.module';
import { PointComponent } from './point.component';
import { RelateListComponent } from '../../business-shared/point/relate-list.component';
import { PointSharedModule } from '../../business-shared/point/point-shared.module';
import {ItemBesListComponent} from '../../business-shared/point/itemBes-list.component';
import {NodeBesListComponent} from '../../business-shared/point/nodeBes-list.component';
import {RelateBesListComponent} from '../../business-shared/point/relateBes-list.component';
import {ProjectListComponent} from '../../business-shared/point/project-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PointRoutingModule,
    CPaginationModule,
    PointSharedModule
  ],
  declarations: [
    PointComponent,
    RelateListComponent,
    ItemBesListComponent,
    NodeBesListComponent,
    RelateBesListComponent,
    ProjectListComponent
  ],
  exports: [
  ],
  providers: []
})

export class PointModule { }
