import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { OttoperateRoutingModule } from './ottoperate-routing.module';
import { OttoperateComponent } from './ottoperate.component';
// import { BannerListComponent } from '../../business-shared/website/banner-list.component';
// import { ArticleListComponent } from '../../business-shared/website/article-list.component';
// import { MessageListComponent } from '../../business-shared/website/message-list.component';
import { OttoperateSharedModule } from '../../business-shared/ottoperate/ottoperate-shared.module';
import {VersionListComponent} from '../../business-shared/ottoperate/version-list.component';
import {OperateListComponent} from '../../business-shared/ottoperate/operate-list.component';
import { OttoperateBusinessService } from '../../business-service/ottoperate/ottoperate-business.service';
import {PageSharedModule} from '../../business-shared/page/page-shared.module';
import {PipeModule} from '../../pipe/pipe.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OttoperateRoutingModule,
    CPaginationModule,
    OttoperateSharedModule,
    PageSharedModule,
    PipeModule,
  ],
  declarations: [
    OttoperateComponent,
    VersionListComponent,
    OperateListComponent
    // BannerListComponent,
    // ArticleListComponent,
    // MessageListComponent,
  ],
  exports: [
  ],
  providers: [OttoperateBusinessService]
})

export class OttoperateModule { }
