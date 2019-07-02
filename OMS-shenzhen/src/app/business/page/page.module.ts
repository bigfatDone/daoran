import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { PageRoutingModule } from './page-routing.module';
import { PageComponent } from './page.component';
import { ElementListComponent } from '../../business-shared/page/element-list.component';
import { PageListComponent } from '../../business-shared/page/page-list.component';
import { ProductListComponent } from '../../business-shared/page/product-list.component';
import { PageSharedModule } from '../../business-shared/page/page-shared.module';
import { PipeModule } from '../../pipe/pipe.module';
import {AlbumTempListComponent} from '../../business-shared/page/albumTemp-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PageRoutingModule,
    CPaginationModule,
    PipeModule,
    PageSharedModule,
  ],
  declarations: [
    PageComponent,
    ElementListComponent,
    PageListComponent,
    ProductListComponent,
    AlbumTempListComponent
  ],
  exports: [
  ],
  providers: [
    // DatepickerI18nType, { provide: NgbDatepickerI18n, useClass: DatepickerI18n }
  ]
})

export class PageModule { }
