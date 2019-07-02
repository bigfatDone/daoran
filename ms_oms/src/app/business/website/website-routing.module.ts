import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WebsiteComponent } from './website.component';
import { BannerListComponent } from '../../business-shared/website/banner-list.component';
import { ArticleListComponent } from '../../business-shared/website/article-list.component';
import { MessageListComponent } from '../../business-shared/website/message-list.component';

const websiteRoutes: Routes = [
  {
    path: '',
    component: WebsiteComponent,
    children: [
      {
        path: 'bannerList',
        component: BannerListComponent
      },
      {
        path: 'articleList',
        component: ArticleListComponent
      },
      {
        path: 'messageList',
        component: MessageListComponent
      }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(websiteRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class WebsiteRoutingModule { }
