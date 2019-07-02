import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { ActiveRoutingModule } from './active-routing.module';
import { ActiveComponent } from './active.component';
import { ActiveListComponent } from '../../business-shared/active/active-list.component';
import { AlbumSharedModule } from '../../business-shared/album/album-shared.module';
import { ProgramSharedModule } from '../../business-shared/program/program-shared.module';
import { PipeModule } from '../../pipe/pipe.module';
import {ActiveSharedModule} from '../../business-shared/active/active-shared.module';
import {AwardListComponent} from '../../business-shared/active/award-list.component';
import {ProductListComponent} from '../../business-shared/active/product-list.component';
import {RelateListComponent} from '../../business-shared/active/relate-list.component';
import {ActRecordListComponent} from '../../business-shared/active/actRecord-list.component';
import {UserActivityListComponent} from '../../business-shared/active/userActivity-list.component';
import {RedPacketListComponent} from '../../business-shared/active/redPacket-list.component';
import {OrderInfoListComponent} from '../../business-shared/active/orderInfo-list.component';

@NgModule({
  imports: [
    CommonModule,
    ActiveRoutingModule,
    NgbModule,
    FormsModule,
    CPaginationModule,
    ActiveSharedModule,
    AlbumSharedModule,
    ProgramSharedModule,
    PipeModule
  ],
  declarations: [
    ActiveComponent,
    ActiveListComponent,
    AwardListComponent,
    ProductListComponent,
    RelateListComponent,
    ActRecordListComponent,
    UserActivityListComponent,
    RedPacketListComponent,
    OrderInfoListComponent,
  ]
})
export class ActiveModule { }
