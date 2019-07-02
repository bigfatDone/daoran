import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
// 正则0~9999，包括0和9999
export const numLimit100: ValidatorFn = function (ctrl: AbstractControl): { [key: string]: boolean } {
  if (Validators.required(ctrl) && null != Validators.required(ctrl)) {
    return null;
  } else {
    return /(^[1-9][0-9]$|^[0-9]$|^100$)/.test(ctrl.value) ? null : { 'numLimit100': true };
  }
}
