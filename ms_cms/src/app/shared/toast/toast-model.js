"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 类型
 */
var ToastType;
(function (ToastType) {
    ToastType[ToastType["SUCCESS"] = 0] = "SUCCESS";
    ToastType[ToastType["INFO"] = 1] = "INFO";
    ToastType[ToastType["WARNING"] = 2] = "WARNING";
    ToastType[ToastType["ERROR"] = 3] = "ERROR";
})(ToastType = exports.ToastType || (exports.ToastType = {}));
/**
 * 配置
 */
var ToastConfig = (function () {
    function ToastConfig(toastType, textStrong, text, autoDismissTime, dismissable) {
        if (textStrong === void 0) { textStrong = ''; }
        if (text === void 0) { text = ''; }
        if (autoDismissTime === void 0) { autoDismissTime = 0; }
        if (dismissable === void 0) { dismissable = true; }
        this.toastType = toastType;
        this.text = text;
        this.textStrong = textStrong;
        this.autoDismissTime = autoDismissTime;
        this.dismissable = dismissable;
    }
    ToastConfig.prototype.getToastType = function () {
        return this.toastType;
    };
    ToastConfig.prototype.getText = function () {
        return this.text;
    };
    ToastConfig.prototype.getTextStrong = function () {
        return this.textStrong;
    };
    ToastConfig.prototype.getAutoDismissTime = function () {
        return this.autoDismissTime;
    };
    ToastConfig.prototype.getDismissable = function () {
        return this.dismissable;
    };
    ToastConfig.prototype.isDismissable = function () {
        return this.autoDismissTime === 0 || this.dismissable;
    };
    ToastConfig.prototype.isAutoDismissing = function () {
        return this.autoDismissTime > 0;
    };
    return ToastConfig;
}());
exports.ToastConfig = ToastConfig;
