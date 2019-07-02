import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent } from './page.component';
import { ElementListComponent } from '../../business-shared/page/element-list.component';
import { PageListComponent } from '../../business-shared/page/page-list.component';
import { ProductListComponent } from '../../business-shared/page/product-list.component';
import { AlbumTempListComponent } from '../../business-shared/page/albumTemp-list.component';
import { MarkManageComponent } from '../../business-shared/page/mark-manage/mark-manage.component';
import {TrainingListComponent} from '../../business-shared/page/training-manage/training-list.component';
import {TrainingDetailSaveComponent} from '../../business-shared/page/training-manage/training-detail.component';
import {TemplateListComponent} from '../../business-shared/page/template-manage/template-list.component';
import {TemplateConfigComponent} from '../../business-shared/page/template-manage/template-config.component';
import {PageConfigComponent} from '../../business-shared/page/template-manage/page-config.component';
const pageRoutes: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      {
        path: 'elementList',
        component: ElementListComponent
      },
      {
        path: 'pageList',
        component: PageListComponent
      },
      {
        path: 'productList',
        component: ProductListComponent
      },
      {
        path: 'albumTempList',
        component: AlbumTempListComponent
      },
      {
        path: 'markManageList',
        component: MarkManageComponent
      },
      {
        path: 'trainingList',
        component: TrainingListComponent
      },
      {
        path: 'trainingdetail',
        component: TrainingDetailSaveComponent
      },
      {
        path: 'allocationTemplate',
        component: TemplateListComponent
      },
      {
        path: 'configTemplate',
        component: TemplateConfigComponent
      },
      {
        path: 'pageConfig',
        component: PageConfigComponent
      }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(pageRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PageRoutingModule { }
