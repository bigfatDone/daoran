"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var utils_1 = require("../util/utils");
var environment_1 = require("../../../environments/environment");
var toast_model_1 = require("../../shared/toast/toast-model");
/**
 * http服务
 */
var HttpService = (function () {
    function HttpService(http, spinService, toastService, router) {
        this.http = http;
        this.spinService = spinService;
        this.toastService = toastService;
        this.router = router;
    }
    HttpService_1 = HttpService;
    HttpService.prototype.request = function (url, body, options, success, error, isNeedLoad, method) {
        var _this = this;
        if (isNeedLoad === void 0) { isNeedLoad = true; }
        if (method === void 0) { method = "post"; }
        if (isNeedLoad) {
            this.spinService.spin(true);
        }
        var that = this;
        var thisHttp;
        if (method === "get") {
            thisHttp = this.http.request(environment_1.environment.domain + url, body);
        }
        else if (method === "delete") {
            thisHttp = this.http.delete(environment_1.environment.domain + url, body);
        }
        else if (method === "put") {
            thisHttp = this.http.put(environment_1.environment.domain + url, body, options);
        }
        else {
            thisHttp = this.http.post(environment_1.environment.domain + url, body, options);
        }
        thisHttp.subscribe(function (res) {
            _this.spinService.spin(false);
            if (!res.json().success && res.json().obj === "11111111") {
                that.router.navigate(['/login']);
            }
            else if (!res.json().success && res.json().obj === "2222") {
                that.router.navigate(['/noPower']);
            }
            else if (!res.json().success) {
                var toastCfg = new toast_model_1.ToastConfig(toast_model_1.ToastType.ERROR, '', res.json().msg, 3000);
                that.toastService.toast(toastCfg);
            }
            else {
                success(res.ok, res.json(), res);
            }
        }, function (err) {
            _this.spinService.spin(false);
            //处理请求失败
            var msg = _this.requestFailed(url, options, err);
            error(err.ok, msg, err);
        });
    };
    HttpService.prototype.get = function (url, paramMap, success, error, isNeedLoad) {
        if (paramMap === void 0) { paramMap = null; }
        if (success === void 0) { success = function (successful, data, res) { }; }
        if (error === void 0) { error = function (successful, msg, err) { }; }
        if (isNeedLoad === void 0) { isNeedLoad = true; }
        return this.request(url, HttpService_1.buildURLSearchParams(paramMap).toString(), new http_1.RequestOptions({
            method: http_1.RequestMethod.Get,
            headers: new http_1.Headers({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            })
        }), success, error, isNeedLoad, "get");
    };
    HttpService.prototype.post = function (url, body, success, error) {
        if (body === void 0) { body = null; }
        if (success === void 0) { success = function (successful, data, res) { }; }
        if (error === void 0) { error = function (successful, msg, err) { }; }
        return this.request(url, body, new http_1.RequestOptions({
            method: http_1.RequestMethod.Post,
            headers: new http_1.Headers({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        }), success, error);
    };
    HttpService.prototype.postFormFile = function (url, paramMap, success, error, isNeedLoad) {
        if (paramMap === void 0) { paramMap = null; }
        if (success === void 0) { success = function (successful, data, res) { }; }
        if (error === void 0) { error = function (successful, msg, err) { }; }
        if (isNeedLoad === void 0) { isNeedLoad = true; }
        return this.request(url, HttpService_1.buildURLSearchParams(paramMap).toString(), new http_1.RequestOptions({
            method: http_1.RequestMethod.Post,
            headers: new http_1.Headers({
                'enctype': 'multipart/form-data'
            })
        }), success, error, isNeedLoad);
    };
    HttpService.prototype.postFormData = function (url, paramMap, success, error, isNeedLoad) {
        if (paramMap === void 0) { paramMap = null; }
        if (success === void 0) { success = function (successful, data, res) { }; }
        if (error === void 0) { error = function (successful, msg, err) { }; }
        if (isNeedLoad === void 0) { isNeedLoad = true; }
        return this.request(url, HttpService_1.buildURLSearchParams(paramMap).toString(), new http_1.RequestOptions({
            method: http_1.RequestMethod.Post,
            headers: new http_1.Headers({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            })
        }), success, error, isNeedLoad);
    };
    HttpService.prototype.put = function (url, paramMap, success, error, isNeedLoad) {
        if (paramMap === void 0) { paramMap = null; }
        if (success === void 0) { success = function (successful, data, res) { }; }
        if (error === void 0) { error = function (successful, msg, err) { }; }
        if (isNeedLoad === void 0) { isNeedLoad = true; }
        return this.request(url, HttpService_1.buildURLSearchParams(paramMap).toString(), new http_1.RequestOptions({
            method: http_1.RequestMethod.Put,
            headers: new http_1.Headers({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        }), success, error, isNeedLoad);
    };
    HttpService.prototype.putFormData = function (url, paramMap, success, error, isNeedLoad) {
        if (paramMap === void 0) { paramMap = null; }
        if (success === void 0) { success = function (successful, data, res) { }; }
        if (error === void 0) { error = function (successful, msg, err) { }; }
        if (isNeedLoad === void 0) { isNeedLoad = true; }
        return this.request(url, HttpService_1.buildURLSearchParams(paramMap).toString(), new http_1.RequestOptions({
            method: http_1.RequestMethod.Post,
            headers: new http_1.Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }), success, error, isNeedLoad);
    };
    HttpService.prototype.delete = function (url, paramMap, success, error, isNeedLoad) {
        if (paramMap === void 0) { paramMap = null; }
        if (success === void 0) { success = function (successful, data, res) { }; }
        if (error === void 0) { error = function (successful, msg, err) { }; }
        if (isNeedLoad === void 0) { isNeedLoad = true; }
        return this.request(url, HttpService_1.buildURLSearchParams(paramMap).toString(), new http_1.RequestOptions({
            method: http_1.RequestMethod.Delete,
            headers: new http_1.Headers({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            })
        }), success, error, isNeedLoad, "delete");
    };
    HttpService.prototype.patch = function (url, body, success, error) {
        if (body === void 0) { body = null; }
        if (success === void 0) { success = function (successful, data, res) { }; }
        if (error === void 0) { error = function (successful, msg, err) { }; }
        return this.request(url, body, new http_1.RequestOptions({
            method: http_1.RequestMethod.Patch
        }), success, error);
    };
    HttpService.prototype.head = function (url, paramMap, success, error) {
        if (paramMap === void 0) { paramMap = null; }
        if (success === void 0) { success = function (successful, data, res) { }; }
        if (error === void 0) { error = function (successful, msg, err) { }; }
        return this.request(url, HttpService_1.buildURLSearchParams(paramMap).toString(), new http_1.RequestOptions({
            method: http_1.RequestMethod.Head
        }), success, error);
    };
    HttpService.prototype.options = function (url, paramMap, success, error) {
        if (paramMap === void 0) { paramMap = null; }
        if (success === void 0) { success = function (successful, data, res) { }; }
        if (error === void 0) { error = function (successful, msg, err) { }; }
        return this.request(url, HttpService_1.buildURLSearchParams(paramMap).toString(), new http_1.RequestOptions({
            method: http_1.RequestMethod.Options
        }), success, error);
    };
    /**
     * 将对象转为查询参数
     * @param paramMap
     * @returns {URLSearchParams}
     */
    HttpService.buildURLSearchParams = function (paramMap) {
        var params = new http_1.URLSearchParams();
        if (!paramMap) {
            return params;
        }
        for (var key in paramMap) {
            var val = paramMap[key];
            if (val instanceof Date) {
                val = utils_1.Utils.dateFormat(val, 'yyyy-MM-dd hh:mm:ss');
            }
            params.set(key, val);
        }
        return params;
    };
    /**
     * 处理请求失败事件
     * @param url
     * @param options
     * @param err
     */
    HttpService.prototype.requestFailed = function (url, options, err) {
        var msg = '请求发生异常', status = err.status;
        if (status === 0) {
            msg = '请求失败，请求响应出错';
        }
        else if (status === 404) {
            msg = '请求失败，未找到请求地址';
        }
        else if (status === 500) {
            msg = '请求失败，服务器出错，请稍后再试';
        }
        else {
            msg = "未知错误，请检查网络";
        }
        return msg;
    };
    HttpService = HttpService_1 = __decorate([
        core_1.Injectable()
    ], HttpService);
    return HttpService;
    var HttpService_1;
}());
exports.HttpService = HttpService;
