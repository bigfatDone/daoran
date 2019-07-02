import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { HttpService } from '../shared/http/http.service';

import { ToastService } from '../shared/toast/toast.service';
import { ToastConfig, ToastType } from '../shared/toast/toast-model';
import { UserBusinessService} from '../business-service/user/user-business.service';

@Component({
  selector: 'c-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  name = "";

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private httpService: HttpService,
    private userBusinessService: UserBusinessService,
    private formBuilder: FormBuilder) {
    let userNameFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(15)]));
    let passwordFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(15)]));
    // let codeFc = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)]));

    this.loginForm = this.formBuilder.group({
      userName: userNameFc,
      password: passwordFc,
      // code: codeFc
    });
  }

  /**
  * 初始化
  */
  ngOnInit() {
    // this.ssoHome();
  }

  ssoHome() {
    let that = this;
    this.userBusinessService.isLogin( function(data){
      if (data.msg === "已登陆") {
        that.router.navigate(['/app/home']);
      }
    });
  }

  /**
   * 登录
   */
  login() {
    // this.router.navigate(['/app/home']);
    if (this.loginForm.valid) {
      let that = this;
      let param;
      param = {
        account:  this.loginForm.controls['userName'].value,
        password:  this.loginForm.controls['password'].value,
      }
      param = {jsonParam:JSON.stringify(param)};
      this.userBusinessService.userLogin(param, function(data){
        localStorage.userInfo = JSON.stringify(data);
        const toastCfg = new ToastConfig(ToastType.SUCCESS, '', data.msg, 3000);
        that.toastService.toast(toastCfg);
        that.router.navigate(['/app/home']);
      });
    }
  }
}
