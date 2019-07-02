import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { PaginationModule} from '../../shared/pagination/pagination.module';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

import { DealerSaveComponent } from './dealer-save.component';
import { InterfaceSaveComponent } from './interface-save.component';
import { RoleSaveComponent } from './role-save.component';

import { CommonBusinessService } from '../../business-service/common/common-business.service';
import {SafetyBusinessService} from '../../business-service/safety/safety-business.service';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import {DealerIpComponent} from './dealer-ip.component';
import {DealerRoleComponent} from './dealer-role.component';
import {RolePowerComponent} from './role-power.component';
import {AllotRoleComponent} from './allot-role.component';
import {RoleInterfaceComponent} from './role-interface.component';

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CPaginationModule,
    CustomScrollbarModule,
    MultiselectDropdownModule
  ],
  declarations: [
    DealerSaveComponent,
    InterfaceSaveComponent,
    RoleSaveComponent,
    DealerIpComponent,
    DealerRoleComponent,
    RolePowerComponent,
    AllotRoleComponent,
    RoleInterfaceComponent
  ],
  entryComponents: [DealerSaveComponent, InterfaceSaveComponent,  RoleSaveComponent, DealerIpComponent, DealerRoleComponent, RolePowerComponent, AllotRoleComponent, RoleInterfaceComponent],
  exports:      [],
  providers:    [
    SafetyBusinessService, CommonBusinessService
  ]
})
export class SafetySharedModule {
}
