import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { NoPowerPageComponent }   from './noPower-page.component';


/**
 * 主体路由
 */
const noPowerPageRoutes: Routes = [
  {
    path: '',
    component: NoPowerPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(noPowerPageRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class NoPowerRoutingModule { }
