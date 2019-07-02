import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { RuleListComponent } from '../../business-shared/order/rule-list.component';
import { ProductListComponent } from '../../business-shared/order/product-list.component';
import { OrderSharedModule } from '../../business-shared/order/order-shared.module';

import { OrderBusinessService } from '../../business-service/order/order-business.service';

import { PipeModule } from '../../pipe/pipe.module';
import {RurelateListComponent} from '../../business-shared/order/rurelate-list.component';
import {TapeListComponent} from '../../business-shared/order/tape-list.component';
import {ConfigListComponent} from '../../business-shared/order/config-list.component';
import {ActiveListComponent} from '../../business-shared/order/active-list.component';
import {AlbumListComponent} from '../../business-shared/order/album-list.component';
import {PictureListComponent} from '../../business-shared/order/picture-list.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OrderRoutingModule,
    CPaginationModule,
    OrderSharedModule,
    PipeModule
  ],
  declarations: [
    OrderComponent,
    RuleListComponent,
    ProductListComponent,
    RurelateListComponent,
    TapeListComponent,
    ConfigListComponent,
    ActiveListComponent,
    AlbumListComponent,
    RurelateListComponent,
    PictureListComponent,
  ],
  exports: [
  ],
  providers: [OrderBusinessService]
})

export class OrderModule { }
