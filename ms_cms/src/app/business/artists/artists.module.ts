import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CPaginationModule} from '../../shared/c-pagination/c-pagination.module';
import { ArtistsRoutingModule } from './artists-routing.module';
import { ArtistsComponent } from './artists.component';
import { ArtistsListComponent } from '../../business-shared/artists/artists-list.component';
import { ArtistsDetailComponent } from '../../business-shared/artists/artists-detail.component';
import { PipeModule } from '../../pipe/pipe.module';
import { ArtistsBusinessService } from '../../business-service/artists/artists-business.service';
import {ArtistsSharedModule} from '../../business-shared/artists/artists-shared.module';
import {CustomScrollbarModule} from '../../shared/custom-scrollbar/custom-scrollbar.module';

@NgModule({
  imports: [
    CommonModule, FormsModule, ArtistsRoutingModule,CustomScrollbarModule, CPaginationModule, PipeModule, ArtistsSharedModule
  ],
  declarations: [
    ArtistsComponent, ArtistsListComponent
  ],
  exports: [
  ],
  providers: [ArtistsBusinessService]
})

export class ArtistsModule { }
