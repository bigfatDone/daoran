import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';


@Component({
  selector: 'c-album',
  template: '<router-outlet></router-outlet>'
})
export class AlbumComponent  {
  constructor(private appService: AppService) {
    this.appService.titleEventEmitter.emit("专辑管理");
  }
}
