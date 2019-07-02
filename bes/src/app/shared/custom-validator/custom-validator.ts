import { equalTo } from './equal-to/equal-to';
import { email } from './email/email';
import { number } from './number/number';
import { url } from './url/url';
import { numLetter } from './num-letter/num-letter';
import { numLetterCase } from './num-letter-case/num-letter-case';
import { numLetterUnderline } from './num-letter-underline/num-letter-underline';
import { numLimit } from './num-limit/num-limit';
import { numLimit100 } from './num-limit/num-limit100';
import { num } from './num/number';
export const CustomValidators: any = {
  'equalTo': equalTo,
  'email': email,
  'number': number,
  'url': url,
  'numLetter': numLetter,
  'numLetterCase': numLetterCase,
  'numLetterUnderline': numLetterUnderline,
  'numLimit': numLimit,
  'numLimit100': numLimit100,
  'num': num,
};
