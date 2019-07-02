import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';

export const numLetter: ValidatorFn = function (ctrl: AbstractControl): { [key: string]: boolean } {
  if (Validators.required(ctrl) && null != Validators.required(ctrl)) {
    return null;
  } else {
    return /^[A-Za-z0-9]+$/g.test(ctrl.value) ? null : { 'numLetter': true };
  }
};
