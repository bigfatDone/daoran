import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramComponent } from './program.component';
import { ProgramListComponent } from '../../business-shared/program/program-list.component';


const programRoutes: Routes = [
  {
    path: '',
    component: ProgramComponent,
    children: [
      {
        path: 'programList',
        component: ProgramListComponent
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
