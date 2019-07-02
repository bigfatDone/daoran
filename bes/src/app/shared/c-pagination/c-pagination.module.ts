import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


import {CPaginationComponent} from './c-pagination.component';

/**
 *  分页模块
 */
@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    NgbPaginationModule
  ],
  declarations: [
    CPaginationComponent
  ],
  exports:[
    CPaginationComponent
  ]
})
export class CPaginationModule { }
