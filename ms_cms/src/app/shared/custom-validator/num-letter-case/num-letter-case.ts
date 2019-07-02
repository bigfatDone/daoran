import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';

export const numLetterCase: ValidatorFn = function (ctrl: AbstractControl): { [key: string]: boolean } {
  if (Validators.required(ctrl) && null != Validators.required(ctrl)) {
    return null;
  } else {
    return /^(?![^a-z]+$)(?![^A-Z]+$)(?!\D+$)/g.test(ctrl.value) ? null : { 'numLetterCase': true };
  }
};
