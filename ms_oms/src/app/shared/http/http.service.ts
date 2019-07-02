import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Http, Response, Headers, RequestOptions, URLSearchParams, RequestOptionsArgs, RequestMethod
} from '@angular/http';
import { Utils } from "../util/utils";
import { SpinService } from '../spin/spin.service';

import { environment } from '../../../environments/environment';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';


/**
 * http服务
 */
@Injectable()
export class HttpService {

  constructor(private http: Http,
              private spinService: SpinService,
              private toastService: ToastService,
              private router: Router) {}

  public request(url: string, body: any, options: RequestOptionsArgs, success: Function, error: Function, isNeedLoad: boolean = true, method: String = "post"): any {
    if (isNeedLoad) {
      this.spinService.spin(true);
    }
    let that = this;
    let thisHttp:any;
    if (method === "get") {
      thisHttp = this.http.request(environment.domain + url, body);
    } else if (method === "delete") {
      thisHttp = this.http.delete(environment.domain + url, body);
    } else if (method === "put") {
      thisHttp = this.http.put(environment.domain + url, body, options);
    } else {
      thisHttp = this.http.post(environment.domain + url, body, options);
    }
    thisHttp.subscribe(res => {
      this.spinService.spin(false);
      if (!res.json().success && res.json().obj === "11111111") {
        that.router.navigate(['/login']);
      }
      else if (res.json().msg === "SESSION_OUT") {
        // window.location.href = "http://oms.daoran.tv";
       // window.location.href = "http://192.168.1.96:9061/jit_pms";
        window.location.href = "http://192.168.1.95:9062/jit_pms";
      }
      else if (!res.json().success && res.json().obj === "2222") {
        that.router.navigate(['/noPower']);
      }
      else if (!res.json().success) {
        const toastCfg = new ToastConfig(ToastType.ERROR, '', res.json().msg, 3000);
        that.toastService.toast(toastCfg);
      } else {
        success(res.ok, res.json(), res);
      }
    }, err => {
      this.spinService.spin(false);
      //处理请求失败
      let msg = this.requestFailed(url, options, err);
      error(err.ok, msg, err);
    });

  }

  public get(url: string, paramMap: any = null, success: Function=function(successful, data, res){}, error: Function=function(successful, msg, err){}, isNeedLoad: boolean = true): any {
    return this.request(url, HttpService.buildURLSearchParams(paramMap).toString(), new RequestOptions({
      method: RequestMethod.Get,
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    }), success, error, isNeedLoad, "get");
  }

  public post(url: string, body: any = null, success: Function=function(successful, data, res){}, error: Function=function(successful, msg, err){}): any {
    return this.request(url, body, new RequestOptions({
      method: RequestMethod.Post,
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    }), success, error);
  }

  public postFormFile(url: string, paramMap: any = null, success: Function=function(successful, data, res){}, error: Function=function(successful, msg, err){}, isNeedLoad: boolean = true): any {
    return this.request(url, paramMap, new RequestOptions({
      method: RequestMethod.Post
    }), success, error, isNeedLoad);
  }

  public postFormData(url: string, paramMap: any = null, success: Function=function(successful, data, res){}, error: Function=function(successful, msg, err){}, isNeedLoad: boolean = true): any {
    return this.request(url, HttpService.buildURLSearchParams(paramMap).toString(), new RequestOptions({
      method: RequestMethod.Post,
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    }), success, error, isNeedLoad);
  }

  public put(url: string, paramMap: any = null, success: Function=function(successful, data, res){}, error: Function=function(successful, msg, err){}, isNeedLoad: boolean = true): any {
    return this.request(url, HttpService.buildURLSearchParams(paramMap).toString(), new RequestOptions({
      method: RequestMethod.Put,
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    }), success, error, isNeedLoad);
  }

  public putFormData(url: string, paramMap: any = null, success: Function=function(successful, data, res){}, error: Function=function(successful, msg, err){}, isNeedLoad: boolean = true): any {
    return this.request(url, HttpService.buildURLSearchParams(paramMap).toString(), new RequestOptions({
      method: RequestMethod.Post,
      headers: new Headers({
        'Content-Type': 'multipart/form-data;'
      })
    }), success, error, isNeedLoad);
  }

  public delete(url: string, paramMap: any = null, success: Function=function(successful, data, res){}, error: Function=function(successful, msg, err){}, isNeedLoad: boolean = true): any {
    return this.request(url, HttpService.buildURLSearchParams(paramMap).toString(), new RequestOptions({
      method: RequestMethod.Delete,
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    }), success, error, isNeedLoad, "delete");
  }

  public patch(url: string, body: any = null, success: Function=function(successful, data, res){}, error: Function=function(successful, msg, err){}): any {
    return this.request(url, body, new RequestOptions({
      method: RequestMethod.Patch
    }), success, error);
  }

  public head(url: string, paramMap: any = null, success: Function=function(successful, data, res){}, error: Function=function(successful, msg, err){}): any {
    return this.request(url, HttpService.buildURLSearchParams(paramMap).toString(), new RequestOptions({
      method: RequestMethod.Head
    }), success, error);
  }

  public options(url: string, paramMap: any = null, success: Function=function(successful, data, res){}, error: Function=function(successful, msg, err){}): any {
    return this.request(url, HttpService.buildURLSearchParams(paramMap).toString(), new RequestOptions({
      method: RequestMethod.Options
    }), success, error);
  }

  /**
   * 将对象转为查询参数
   * @param paramMap
   * @returns {URLSearchParams}
   */
  private static buildURLSearchParams(paramMap): URLSearchParams {
    let params = new URLSearchParams();
    if (!paramMap) {
      return params;
    }
    for (let key in paramMap) {
      let val = paramMap[key];
      if (val instanceof Date) {
        val = Utils.dateFormat(val, 'yyyy-MM-dd hh:mm:ss')
      }
      params.set(key, val);
    }
    return params;
  }

  /**
   * 处理请求失败事件
   * @param url
   * @param options
   * @param err
   */
  private requestFailed(url: string, options: RequestOptionsArgs, err) {
    let msg = '请求发生异常', status = err.status;
    if (status === 0) {
      msg = '请求失败，请求响应出错';
    } else if (status === 404) {
      msg = '请求失败，未找到请求地址';
    } else if (status === 500) {
      msg = '请求失败，服务器出错，请稍后再试';
    } else {
      msg = "未知错误，请检查网络";
    }

    return msg;

  }
}
