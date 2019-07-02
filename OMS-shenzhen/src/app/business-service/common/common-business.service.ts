import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../../shared/toast/toast-model';
import { environment } from '../../../environments/environment';

@Injectable()

export class CommonBusinessService {

  constructor(private httpService: HttpService, private toastService: ToastService) { }

  api: any = {
    uploadPic: "/busi/pic/upload",
    uploadExcel: "/busi/list/addrestolistbyexcel",
  }

  uploadPicPost(param, callback) {
    this.httpService.postFormFile(this.api.uploadPic, param, function (successful, data, res) {
      if (successful) {
        callback(data.obj);
      }
    }, function (successful, msg, err) {
    }, false);
  }

  uploadExcelPost(param, callback) {
    this.httpService.postFormFile(this.api.uploadExcel, param, function (successful, data, res) {
      if (successful) {
        callback(data);
      }
    }, function (successful, msg, err) {
    });
  }
}
