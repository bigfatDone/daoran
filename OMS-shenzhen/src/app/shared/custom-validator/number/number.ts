import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
// 正则0~100的整数，包括0和100
export const number: ValidatorFn = function (ctrl: AbstractControl): { [key: string]: boolean } {
    if (Validators.required(ctrl) && null != Validators.required(ctrl)) {
        return null;
    } else {
        return /(^[1-9][0-9]$|^[0-9]$|^100$)/.test(ctrl.value) ? null : { 'number': true };
    }
};
