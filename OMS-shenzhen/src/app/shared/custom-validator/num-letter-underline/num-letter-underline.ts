import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';

export const numLetterUnderline: ValidatorFn = function (ctrl: AbstractControl): { [key: string]: boolean } {
  if (Validators.required(ctrl) && null != Validators.required(ctrl)) {
    return null;
  } else {
    // return /^(?!_.)(?!.*?_$)[a-zA-Z0-9_.]+$/g.test(ctrl.value) ? null : { 'numLetterUnderline': true };
    return /^(?!.*?_$)[a-zA-Z0-9_.]+$/g.test(ctrl.value) ?  null : { 'numLetterUnderline': true };
  }
};
