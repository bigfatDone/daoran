import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipeModule } from '../../pipe/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { PaginationModule} from '../../shared/pagination/pagination.module';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { JumpRoutingModule } from './jump-routing.module';
import { JumpComponent } from './jump.component';
import { JumpListComponent } from '../../business-shared/jump/jump-list.component';
import { JumpSharedModule } from '../../business-shared/jump/jump-shared.module';
import { OrderBusinessService } from '../../business-service/order/order-business.service';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';
import { CDropdownModule } from '../../shared/c-dropdown/c-dropdown.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    JumpRoutingModule,
    JumpSharedModule,
    CPaginationModule,
    PipeModule,
    NgbModule,
    CustomScrollbarModule,
    CDropdownModule
  ],
  declarations: [
    JumpComponent,
    JumpListComponent
  ],
  exports: [
  ],
  providers: [
    OrderBusinessService
  ]
})

export class JumpModule { }
