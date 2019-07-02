import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RelateSaveComponent } from './relate-save.component';

import { PointBusinessService } from '../../business-service/point/point-business.service';
import { OrderBusinessService } from '../../business-service/order/order-business.service';
import {ItemBesSaveComponent} from './itemBes-save.component';
import {RelateBesSaveComponent} from './relateBes-save.component';
import {NodeBesSaveComponent} from './nodeBes-save.component';
import {ProjectSaveComponent} from './project-save.component';

/**
 * 节目单共享模块
 */
@NgModule({
  imports:      [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    RelateSaveComponent,
    ItemBesSaveComponent,
    NodeBesSaveComponent,
    RelateBesSaveComponent,
    ProjectSaveComponent
  ],
  entryComponents: [
    RelateSaveComponent,
    ItemBesSaveComponent,
    NodeBesSaveComponent,
    RelateBesSaveComponent,
    ProjectSaveComponent
  ],
  exports:      [],
  providers:    [
    OrderBusinessService
  ]
})
export class PointSharedModule {

}
