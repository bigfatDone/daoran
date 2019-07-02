import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { MenuComponent } from './menu.component';
import { MenuListComponent } from '../../business-shared/menu/menu-list.component';


const programRoutes: Routes = [
  {
    path: '',
    component: MenuListComponent,
    children: [
      {
        path: 'menuList',
        component: MenuListComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(programRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProgramRoutingModule { }
