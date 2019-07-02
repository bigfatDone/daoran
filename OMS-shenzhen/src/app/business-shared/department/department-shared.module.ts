import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import  { ZtreeModule} from '../../shared/ztree/ztree.module';//ztree
import  { CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';//滚动条
import { DepartmentSaveComponent } from './department-save.component';
import { JobSaveComponent } from './job-save.component';
import { CompanySaveComponent } from './company-save.component';
import { PowerSaveComponent } from './power-save.component';

import { DepartmentBusinessService } from '../../business-service/department/department-business.service';


/**
 * 节目单共享模块
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ZtreeModule,
    CustomScrollbarModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DepartmentSaveComponent,
    JobSaveComponent,
    CompanySaveComponent,
    PowerSaveComponent
  ],
  entryComponents: [DepartmentSaveComponent, JobSaveComponent, CompanySaveComponent, PowerSaveComponent],
  exports:      [],
  providers:    [
    DepartmentBusinessService
  ]
})
export class DepartmentSharedModule {

}
