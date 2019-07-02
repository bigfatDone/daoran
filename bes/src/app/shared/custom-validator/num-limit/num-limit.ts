import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
// 正则0~9999的整数，包括0和9999
export const numLimit: ValidatorFn = function (ctrl: AbstractControl): { [key: string]: boolean } {
  if (Validators.required(ctrl) && null != Validators.required(ctrl)) {
    return null;
  } else {
    return /^[1-9]{1}\d{0,3}$|^0$/.test(ctrl.value) ? null : { 'numLimit': true };
  }
}
