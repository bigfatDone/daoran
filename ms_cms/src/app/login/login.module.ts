import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserBusinessService} from '../business-service/user/user-business.service';

import { LoginComponent } from './login.component';

import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports:      [
     CommonModule,
     FormsModule,
     ReactiveFormsModule,
     NgbModule,
     LoginRoutingModule
  ],
  declarations: [
     LoginComponent
  ],
  exports:      [],
  providers:    [UserBusinessService]
})
export class LoginModule { }
