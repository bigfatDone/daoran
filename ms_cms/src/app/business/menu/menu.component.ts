import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';


@Component({
  selector: 'c-menu',
  template: '<router-outlet></router-outlet>'
})
export class MenuComponent  {
  constructor(private appService: AppService) {
    this.appService.titleEventEmitter.emit("菜单管理");
  }
}
