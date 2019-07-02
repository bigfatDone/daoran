import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';
import { PipeModule } from '../../pipe/pipe.module';
import { ResourcesBusinessService } from '../../business-service/resources/resources-business.service';
import {ResourcesSharedModule} from '../../business-shared/resources/resources-shared.module';
import {AudioListComponent} from '../../business-shared/resources/audio-list.component';
import {DrawListComponent} from '../../business-shared/resources/draw-list.component';
import {VideoListComponent} from '../../business-shared/resources/video-list.component';
import {CustomScrollbarDirective} from '../../shared/custom-scrollbar/custom-scrollbar.directive';
import {CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

@NgModule({
  imports: [
    CommonModule, NgbModule, FormsModule,CustomScrollbarModule, ResourcesRoutingModule, CPaginationModule, PipeModule, ResourcesSharedModule
  ],
  declarations: [
    ResourcesComponent,
    AudioListComponent,
    DrawListComponent,
    VideoListComponent
  ],
  exports: [
  ],
  providers: [ResourcesBusinessService]
})

export class ResourcesModule { }
