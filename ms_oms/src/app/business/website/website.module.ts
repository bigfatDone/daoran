import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { WebsiteRoutingModule } from './website-routing.module';
import { WebsiteComponent } from './website.component';
import { BannerListComponent } from '../../business-shared/website/banner-list.component';
import { ArticleListComponent } from '../../business-shared/website/article-list.component';
import { MessageListComponent } from '../../business-shared/website/message-list.component';
import { WebsiteSharedModule } from '../../business-shared/website/website-shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WebsiteRoutingModule,
    CPaginationModule,
    WebsiteSharedModule
  ],
  declarations: [
    WebsiteComponent,
    BannerListComponent,
    ArticleListComponent,
    MessageListComponent,
  ],
  exports: [
  ],
  providers: []
})

export class WebsiteModule { }
