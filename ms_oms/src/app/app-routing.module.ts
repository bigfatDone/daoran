import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {SelectivePreloadingStrategy} from "./selective-preloading-strategy";

import { PageNotFoundComponent } from './error-page/page-not-found.component';


/**
 * app路由
 */
const appRoutes: Routes = [
 { path: '', redirectTo: '/app/home', pathMatch: 'full' },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
 // { path: '', redirectTo: '/app/home', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: 'app/login/login.module#LoginModule'
  },
  {
     path: 'app',
     loadChildren: 'app/main/main.module#MainModule'
  },
  {
    path:'noPower',
    loadChildren: 'app/noPower-page/noPower-page.module#NoPowerPageModule'  },

  {
     path:'**',
      component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
   // RouterModule.forRoot(appRoutes,{ preloadingStrategy: SelectivePreloadingStrategy, useHash: true})
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}


