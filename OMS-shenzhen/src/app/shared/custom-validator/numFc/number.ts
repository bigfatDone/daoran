import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
// 正则纯数字
export const numFc: ValidatorFn = function (ctrl: AbstractControl): { [key: string]: boolean } {
    if (Validators.required(ctrl) && null != Validators.required(ctrl)) {
        return null;
    } else {
        return /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/g.test(ctrl.value) ? null : { 'num': true };
    }
};
