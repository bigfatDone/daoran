import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


import {DropDownComponent} from './drop-down.component';

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
    DropDownComponent
  ],
  exports: [
    DropDownComponent
  ]
})
export class DropDownComponentModule { }
