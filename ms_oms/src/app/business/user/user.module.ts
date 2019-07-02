import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
import { UserBusinessService} from '../../business-service/user/user-business.service';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserListComponent } from '../../business-shared/user/user-list.component';
import { SysListComponent } from '../../business-shared/user/sys-list.component';
import { PipeModule } from '../../pipe/pipe.module';
import { UserSharedModule } from '../../business-shared/user/user-shared.module';

@NgModule({
  imports: [
    CommonModule, FormsModule, UserRoutingModule, CPaginationModule, PipeModule, UserSharedModule
  ],
  declarations: [
    UserComponent, UserListComponent, SysListComponent
  ],
  exports: [
  ],
  providers: []
})

export class UserModule { }
