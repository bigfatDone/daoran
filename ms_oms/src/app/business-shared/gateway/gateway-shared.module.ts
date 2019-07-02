import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
import { GatewaySaveComponent } from './gateway-save.component';

import { GatewayBusinessService } from '../../business-service/gateway/gateway-business.service';

import { PipeModule } from '../../pipe/pipe.module';
import {SqllogDetailComponent} from './sqllog-detail.component';


/**
 * 节目单共享模块
 */
@NgModule({
  imports:      [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    CPaginationModule
  ],
  declarations: [
    GatewaySaveComponent, SqllogDetailComponent
  ],
  entryComponents: [GatewaySaveComponent, SqllogDetailComponent],
  exports:      [],
  providers:    [
    GatewayBusinessService
  ]
})
export class GatewaySharedModule {

}
