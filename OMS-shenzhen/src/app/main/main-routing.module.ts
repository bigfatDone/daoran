import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import {SelectivePreloadingStrategy} from '../selective-preloading-strategy';

/**
 * 主体路由
 */
export const mainRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'home', loadChildren: 'app/business/home/home.module#HomeModule' },
      // { path: 'demo', loadChildren: 'app/business/demo/demo.module#DemoModule' },
      { path: 'menu', loadChildren: 'app/business/menu/menu.module#MenuModule' },
      { path: 'user', loadChildren: 'app/business/user/user.module#UserModule' },
      // { path: 'role', loadChildren: 'app/business/role/role.module#RoleModule' },
      // { path: 'sysLog', loadChildren: 'app/business/sys-log/sys-log.module#SysLogModule' },
      // { path: 'sysMonitor', loadChildren: 'app/business/sys-monitor/sys-monitor.module#SysMonitorModule' },
      { path: 'department', loadChildren: 'app/business/department/department.module#DepartmentModule' },
      { path: 'program', loadChildren: 'app/business/program/program.module#ProgramModule' },
      { path: 'page', loadChildren: 'app/business/page/page.module#PageModule' },
      { path: 'order', loadChildren: 'app/business/order/order.module#OrderModule' },
      { path: 'entry', loadChildren: 'app/business/entry/entry.module#EntryModule' },
      // { path: 'gateway', loadChildren: 'app/business/gateway/gateway.module#GatewayModule' },
      // { path: 'website', loadChildren: 'app/business/website/website.module#WebsiteModule' },
      { path: 'point', loadChildren: 'app/business/point/point.module#PointModule' },
      { path: 'jump', loadChildren: 'app/business/jump/jump.module#JumpModule' },
      // { path: 'draw', loadChildren: 'app/business/draw/draw.module#DrawModule' },
      // { path: 'history', loadChildren: 'app/business/history/history.module#HistoryModule' },
      // { path: 'picture', loadChildren: 'app/business/picture/picture.module#PictureModule' },
      // { path: 'odsys', loadChildren: 'app/business/odsys/odsys.module#OdsysModule' },
      // { path: 'safety', loadChildren: 'app/business/safety/safety.module#SafetyModule' },
      { path: 'album', loadChildren: 'app/business/album/album.module#AlbumModule' },
      // { path: 'message', loadChildren: 'app/business/message/message.module#MessageModule'},
      { path: 'active', loadChildren: 'app/business/active/active.module#ActiveModule'},
      // { path: 'albumTemp', loadChildren: 'app/business/albumTemp/albumTemp.module#AlbumTempModule'},
      // { path: 'ottoperate', loadChildren: 'app/business/ottoperate/ottoperate.module#OttoperateModule'},
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(mainRoutes)
    // RouterModule.forRoot(mainRoutes,{ preloadingStrategy: SelectivePreloadingStrategy, useHash: true})
  ],
  exports: [
    RouterModule
  ]
})
export class MainRoutingModule { }
