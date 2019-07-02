import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';

export const email: ValidatorFn = function (ctrl: AbstractControl): { [key: string]: boolean } {
  if (Validators.required(ctrl) && null != Validators.required(ctrl)) {
    return null;
  } else {
    return /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(ctrl.value) ? null : { 'email': true };
  }
};
