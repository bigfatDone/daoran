import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-department',
  template: '<router-outlet></router-outlet>'
})
export class DepartmentComponent {
  constructor(private appService: AppService) {
    this.appService.titleEventEmitter.emit("菜单管理");
  }
}
