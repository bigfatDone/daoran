import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule} from '../../shared/pagination/pagination.module';

import { ProgramRoutingModule } from './menu-routing.module';
import { MenuComponent} from './menu.component';
import { MenuListComponent} from '../../business-shared/menu/menu-list.component';
import { MenuTreeComponent } from '../../business-shared/menu/menu-tree.component';
import { ZtreeModule } from '../../shared/ztree/ztree.module';
import { MenuSharedModule } from '../../business-shared/menu/menu-shared.module';

import { MenuBusinessService } from '../../business-service/menu/menu-business.service';

@NgModule({
  imports: [
    CommonModule,
    ProgramRoutingModule,
    FormsModule,
    ZtreeModule,
    MenuSharedModule,
    PaginationModule
  ],
  declarations: [
    MenuComponent,
    MenuListComponent,
    MenuTreeComponent
  ],
  exports:      [],
  providers:    [MenuBusinessService]
})
export class MenuModule { }
