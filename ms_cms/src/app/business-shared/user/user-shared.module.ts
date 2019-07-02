import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { ImgCropperSelectModule} from '../../shared/img-cropper-select/img-cropper-select.module';
import { AvatarCropperComponent} from './avatar-cropper.component';
import { UserSaveComponent } from './user-save.component';
import { UserPasswordComponent } from './user-password.component';
import { UserBusinessService } from '../../business-service/user/user-business.service';
import { PipeModule } from '../../pipe/pipe.module';

@NgModule({
  imports:      [
    NgbModule, CommonModule, FormsModule, ReactiveFormsModule, ImageCropperModule, ImgCropperSelectModule, PipeModule
  ],
  declarations: [
    AvatarCropperComponent, UserPasswordComponent, UserSaveComponent
  ],
  entryComponents: [ AvatarCropperComponent, UserPasswordComponent, UserSaveComponent],
  exports:      [],
  providers:    [
    UserBusinessService
  ]
})
  export class UserSharedModule {
}
