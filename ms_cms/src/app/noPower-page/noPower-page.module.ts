import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserBusinessService} from '../business-service/user/user-business.service';

import { NoPowerPageComponent } from './noPower-page.component';

import { NoPowerRoutingModule } from './noPower-routing.module';

@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NoPowerRoutingModule
  ],
  declarations: [
    NoPowerPageComponent
  ],
  exports:      [],
  providers:    [UserBusinessService]
})
export class NoPowerPageModule { }
