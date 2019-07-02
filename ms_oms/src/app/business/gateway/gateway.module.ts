import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { GatewayRoutingModule } from './gateway-routing.module';
import { GatewayComponent } from './gateway.component';
import { GatewayListComponent } from '../../business-shared/gateway/gateway-list.component';
import { GatewaySharedModule } from '../../business-shared/gateway/gateway-shared.module';
import { GatewayBusinessService } from '../../business-service/gateway/gateway-business.service';

import { PipeModule } from '../../pipe/pipe.module';
import {SqllogListComponent} from '../../business-shared/gateway/sqllog-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GatewayRoutingModule,
    CPaginationModule,
    GatewaySharedModule,
    PipeModule
  ],
  declarations: [
    GatewayComponent,
    GatewayListComponent,
    SqllogListComponent
  ],
  exports: [
  ],
  providers: [GatewayBusinessService]
})

export class GatewayModule { }
