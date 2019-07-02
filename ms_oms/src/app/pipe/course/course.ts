import { Pipe, PipeTransform } from '@angular/core';
import { courseData } from '../../global-constant';
@Pipe({
  name: 'courseData'
})
export class CourseDataPipe implements PipeTransform {
  transform(value) {
    for (let i of courseData) {
      if (i.type === value) {
        return i.values;
      }
    }
  }
}
