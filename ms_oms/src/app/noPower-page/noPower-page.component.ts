import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserBusinessService } from '../business-service/user/user-business.service';

@Component({
  selector: 'c-noPower-page',
  templateUrl: './noPower-page.component.html',
  styleUrls: ['./noPower-page.component.scss']
})
export class NoPowerPageComponent {
  constructor(private router: Router, private userBusinessService: UserBusinessService) {
  }

  returnLogin() {
    let that = this;
    this.userBusinessService.userLogout(function(data){
      that.router.navigate(['/login']);
    });
  }
}
