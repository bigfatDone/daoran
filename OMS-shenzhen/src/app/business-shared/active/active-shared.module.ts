import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationModule} from '../../shared/pagination/pagination.module';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

import { ActiveSaveComponent } from './active-save.component';

import {ActiveBusinessService} from '../../business-service/active/active-business.service';
import { CommonBusinessService } from '../../business-service/common/common-business.service';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import {AwardSaveComponent} from './award-save.component';
import {RelateSaveComponent} from './relate-save.component';
import {ProductSaveComponent} from './product-save.component';
import {ActRecordSaveComponent} from './actRecord-save.component';

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
    ActiveSaveComponent,
    AwardSaveComponent,
    ProductSaveComponent,
    RelateSaveComponent,
    ActRecordSaveComponent
  ],
  entryComponents: [ActiveSaveComponent, AwardSaveComponent, ProductSaveComponent, RelateSaveComponent,
    ActRecordSaveComponent
  ],
  exports:      [],
  providers:    [
    ActiveBusinessService, CommonBusinessService
  ]
})
export class ActiveSharedModule {
}
