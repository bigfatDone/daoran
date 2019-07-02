import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResourcesComponent } from './resources.component';
import { AudioListComponent } from '../../business-shared/resources/audio-list.component';
import { AudioDetailComponent } from '../../business-shared/resources/audio-detail.component';
import { VideoListComponent } from '../../business-shared/resources/video-list.component';
import { VideoDetailComponent } from '../../business-shared/resources/video-detail.component';
import { DrawListComponent } from '../../business-shared/resources/draw-list.component';
import { DrawDetailComponent } from '../../business-shared/resources/draw-detail.component';

const resourcesRoutes: Routes = [
  {
    path: '',
    component: ResourcesComponent,
    children: [
      {
        path: 'audioList',
        component: AudioListComponent
      },
      {
        path: 'audioList/:artCode',
        component: AudioListComponent
      },
      {
        path: 'audioDetail/:id',
        component: AudioDetailComponent
      },
      {
        path: 'videoList',
        component: VideoListComponent
      },
      {
        path: 'videoList/:artCode',
        component: VideoListComponent
      },
      {
        path: 'videoDetail/:id',
        component: VideoDetailComponent
      },
      {
        path: 'drawList',
        component: DrawListComponent
      },
      {
        path: 'drawDetail/:id',
        component: DrawDetailComponent
      }
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild(resourcesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ResourcesRoutingModule { }
