import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

/**
 * 主体路由
 */
const mainRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'home', loadChildren: 'app/business/home/home.module#HomeModule' },
      { path: 'resources', loadChildren: 'app/business/resources/resources.module#ResourcesModule' },
      { path: 'artists', loadChildren: 'app/business/artists/artists.module#ArtistsModule' },
      { path: 'user', loadChildren: 'app/business/user/user.module#UserModule' },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(mainRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MainRoutingModule { }
