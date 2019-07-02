import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationModule} from '../../shared/pagination/pagination.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

import { CodeSaveComponent } from './code-save.component';
import { TmpConfigSaveComponent } from './tmp-config-save.component';
import { TmpInfoSaveComponent } from './tmp-info-save.component';
import { InOutChargeSaveComponent } from './inOutCharge-save.component';

import { OdsysBusinessService } from '../../business-service/odsys/odsys-business.service';
import { CommonBusinessService } from '../../business-service/common/common-business.service';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import {InChargeSaveComponent} from './inCharge-save.component';
import {OutChargeSaveComponent} from './outCharge-save.component';
import {OrderChargeSaveComponent} from './orderCharge-save.component';
import {OderRelationshipInfo} from './order-relationship-info.component';
@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    CustomScrollbarModule,
    MultiselectDropdownModule
  ],
  declarations: [
    CodeSaveComponent,
    TmpConfigSaveComponent,
    TmpInfoSaveComponent,
    InOutChargeSaveComponent,
    InChargeSaveComponent,
    OutChargeSaveComponent,
    OrderChargeSaveComponent,
    OderRelationshipInfo
  ],
  entryComponents: [CodeSaveComponent, TmpConfigSaveComponent,  TmpInfoSaveComponent, InOutChargeSaveComponent, InChargeSaveComponent, OutChargeSaveComponent, OrderChargeSaveComponent, OderRelationshipInfo],
  exports:      [],
  providers:    [
    OdsysBusinessService, CommonBusinessService
  ]
})
export class OdsysSharedModule {
}
