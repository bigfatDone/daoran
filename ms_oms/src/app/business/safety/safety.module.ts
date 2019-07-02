import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
// import { PaginationModule} from '../../shared/pagination/pagination.module';

import { SafetyRoutingModule } from './safety-routing.module';
import { SafetyComponent } from './safety.component';
import { SafetySharedModule } from '../../business-shared/safety/safety-shared.module';

import { SafetyBusinessService } from '../../business-service/safety/safety-business.service';

import { PipeModule } from '../../pipe/pipe.module';
import {DealerListComponent} from '../../business-shared/safety/dealer-list.component';
import {InterfaceListComponent} from '../../business-shared/safety/interface-list.component';
import {RoleListComponent} from '../../business-shared/safety/role-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SafetyRoutingModule,
    CPaginationModule,
    SafetySharedModule,
    PipeModule
  ],
  declarations: [
    SafetyComponent,
    DealerListComponent,
    InterfaceListComponent,
    RoleListComponent
  ],
  exports: [
  ],
  providers: [SafetyBusinessService]
})

export class SafetyModule { }
