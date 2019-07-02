import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';


import {DropDownComponent} from './drop-down.component';

/**
 *  分页模块
 */
@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    CustomScrollbarModule
  ],
  declarations: [
    DropDownComponent
  ],
  exports: [
    DropDownComponent
  ]
})
export class DropDownComponentModule { }
