import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OttoperateComponent } from './ottoperate.component';
import { VersionListComponent } from '../../business-shared/ottoperate/version-list.component';
import { OperateListComponent } from '../../business-shared/ottoperate/operate-list.component';
import { VipListComponent } from '../../business-shared/ottoperate/vip-list.component';
// import { ArticleListComponent } from '../../business-shared/website/article-list.component';
// import { MessageListComponent } from '../../business-shared/website/message-list.component';

const ottoperateRoutes: Routes = [
  {
    path: '',
    component: OttoperateComponent,
    children: [
      {
        path: 'versionList',
        component: VersionListComponent
      },
      {
        path: 'operateList',
        component: OperateListComponent
      },
      {
        path: 'vipList',
        component: VipListComponent
      },
      // {
      //   path: 'messageList',
      //   component: MessageListComponent
      // }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(ottoperateRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class OttoperateRoutingModule {}
