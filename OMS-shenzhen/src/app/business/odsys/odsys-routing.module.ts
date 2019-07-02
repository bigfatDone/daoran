import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OdsysComponent } from './odsys.component';
import { CodeListComponent } from '../../business-shared/odsys/code-list.component';
import { TmpInfoListComponent } from '../../business-shared/odsys/tmp-info-list.component';
import { TmpConfigListComponent } from '../../business-shared/odsys/tmp-config-list.component';
import {InChargeListComponent} from '../../business-shared/odsys/inCharge-list.component';
import {OutChargeListComponent} from '../../business-shared/odsys/outCharge-list.component';
import {InOutChargeListComponent} from '../../business-shared/odsys/inOutCharge-list.component';
import {OrderChargeListComponent} from '../../business-shared/odsys/orderCharge-list.component';
const orsysRoutes: Routes = [
  {
    path: '',
    component: OdsysComponent,
    children: [
      {
        path: 'codeList',
        component: CodeListComponent
      },
      {
        path: 'tmpInfoList',
        component: TmpInfoListComponent
      },
      {
        path: 'tmpConfigList',
        component: TmpConfigListComponent
      },
      {
        path: 'inChargeList',
        component: InChargeListComponent
      },
      {
        path: 'outChargeList',
        component: OutChargeListComponent
      },
      {
        path: 'allChargeList',
        component: InOutChargeListComponent
      },
      {
        path: 'ordChargeList',
        component: OrderChargeListComponent
      },
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(orsysRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class OdsysRoutingModule { }
