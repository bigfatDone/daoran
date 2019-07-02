import { Injectable,EventEmitter } from '@angular/core';


/**
 * app服务
 */
@Injectable()
export class AppService {
  // 菜单
  public updateMenus: any;

  // 标题
  titleEventEmitter: EventEmitter<string>;

  constructor() {
    this.titleEventEmitter = new EventEmitter();
    this.updateMenus = new EventEmitter();
  }

}
