import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';


@Component({
  selector: 'c-active',
  template: '<router-outlet></router-outlet>'
})
export class ActiveComponent  {
  constructor(private appService: AppService) {
    this.appService.titleEventEmitter.emit("活动管理");
  }
}
