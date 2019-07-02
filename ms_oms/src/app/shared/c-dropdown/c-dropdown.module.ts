import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CDropdownComponent } from './c-dropdown.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    CDropdownComponent
  ],
  exports: [
    CDropdownComponent
  ]
})
export class CDropdownModule { }
