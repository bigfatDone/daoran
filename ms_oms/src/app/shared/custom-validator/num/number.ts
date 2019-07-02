import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
// 正则纯数字
export const num: ValidatorFn = function (ctrl: AbstractControl): { [key: string]: boolean } {
    if (Validators.required(ctrl) && null != Validators.required(ctrl)) {
        return null;
    } else {
        return /^\d+$/g.test(ctrl.value) ? null : { 'num': true };
    }
};
