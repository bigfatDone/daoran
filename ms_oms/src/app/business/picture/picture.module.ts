import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipeModule } from '../../pipe/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { PictureRoutingModule } from './picture-routing.module';
import { PictureComponent } from './picture.component';
import { PictureManagementComponent } from '../../business-shared/picture/picture-management.component';
import { PictureSharedModule } from '../../business-shared/picture/picture-shared.module';
import {CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PictureRoutingModule,
    PictureSharedModule,
    CustomScrollbarModule,
    CPaginationModule,
    PipeModule
  ],
  declarations: [
    PictureComponent,
    PictureManagementComponent,
  ],
  exports: [
  ],
  providers: []
})

export class PictureModule { }
