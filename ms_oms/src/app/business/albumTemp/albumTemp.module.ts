import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';

import { AlbumTempRoutingModule } from './albumTemp-routing.module';
import { AlbumTempComponent } from './albumTemp.component';
import { AlbumTempConfigComponent } from '../../business-shared/albumTemp/albumTemp-config.component';
// import { ArticleListComponent } from '../../business-shared/website/article-list.component';
// import { MessageListComponent } from '../../business-shared/website/message-list.component';
import { AlbumTempSharedModule } from '../../business-shared/albumTemp/albumTemp-shared.module';
import { PageSharedModule } from '../../business-shared/page/page-shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    AlbumTempRoutingModule,
    CPaginationModule,
    AlbumTempSharedModule,
    PageSharedModule
  ],
  declarations: [
    AlbumTempComponent,
    AlbumTempConfigComponent,
    // ArticleListComponent,
    // MessageListComponent,
  ],
  exports: [
  ],
  providers: []
})

export class AlbumTempModule { }
