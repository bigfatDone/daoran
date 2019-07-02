import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CustomScrollbarModule} from '../shared/custom-scrollbar/custom-scrollbar.module';
import { ModalModule } from '../shared/modal/modal.module';


import { UserSharedModule } from '../business-shared/user/user-shared.module';
import { MainComponent } from './main.component';
import { SidebarMenuComponent } from './sidebar-menu.component';
import { TreeviewMenuComponent } from './treeview-menu.component';

import { MainRoutingModule } from './main-routing.module';

import { MainBusinessService } from '../business-service/main/main-business.service';
import { MenuBusinessService } from '../business-service/menu/menu-business.service';


/**
 * 主体模块
 */
@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    NgbModule,
    MainRoutingModule,
    CustomScrollbarModule,
    UserSharedModule,
    ModalModule
  ],
  declarations: [
    MainComponent,
    SidebarMenuComponent,
    TreeviewMenuComponent
  ],
  exports: [],
  providers: [MainBusinessService, MenuBusinessService]
})
export class MainModule {
}
