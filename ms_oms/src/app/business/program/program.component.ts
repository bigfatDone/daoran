import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';


@Component({
  selector: 'c-program',
  template: '<router-outlet></router-outlet>'
})
export class ProgramComponent  {
  constructor(private appService: AppService) {
    this.appService.titleEventEmitter.emit("节目单管理");
  }
}
