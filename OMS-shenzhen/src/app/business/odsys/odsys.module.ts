import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { OdsysRoutingModule } from './odsys-routing.module';
import { OdsysComponent } from './odsys.component';
import { CodeListComponent } from '../../business-shared/odsys/code-list.component';
import { TmpConfigListComponent } from '../../business-shared/odsys/tmp-config-list.component';
import { TmpInfoListComponent } from '../../business-shared/odsys/tmp-info-list.component';
import {InChargeListComponent} from '../../business-shared/odsys/inCharge-list.component';
import {OutChargeListComponent} from '../../business-shared/odsys/outCharge-list.component';
import {InOutChargeListComponent} from '../../business-shared/odsys/inOutCharge-list.component';
import {OrderChargeListComponent} from '../../business-shared/odsys/orderCharge-list.component';
import { OdsysSharedModule } from '../../business-shared/odsys/odsys-shared.module';

import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';

import { PipeModule } from '../../pipe/pipe.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OdsysRoutingModule,
    CPaginationModule,
    OdsysSharedModule,
    PipeModule
  ],
  declarations: [
    OdsysComponent,
    CodeListComponent,
    TmpConfigListComponent,
    TmpInfoListComponent,
    InChargeListComponent,
    OutChargeListComponent,
    InOutChargeListComponent,
    OrderChargeListComponent
  ],
  exports: [
  ],
  providers: [OdsysBusinessService]
})

export class OdsysModule { }
