import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageEleAttrPipe } from './page-eleAttr/page-eleAttr.pipe';
import { PageElementPipe } from './page-element/page-element.pipe';
import { PagePageGenrePipe } from './page-pageGenre/page-pageGenre.pipe';
import { PagePageTypePipe } from './page-pageType/page-pageType.pipe';
import { PageResourcesPipe } from './page-resources/page-resources.pipe';

import { ProgramFreeFlagPipe } from './program-freeFlag/program-freeFlag.pipe';
import { ProgramTypePipe } from './program-type/program-type.pipe';

import { UserCompanyPipe } from './user-company/user-company.pipe';
import { UserTypePipe } from './user-type/user-type.pipe';

import { GwTaskStatesPipe } from './gw-taskStates/gw-taskStates.pipe';

import { OrderRuleWeekPipe } from './order-ruleWeek/order-ruleWeek.pipe';
import { OrderRuleITypePipe } from './order-ruleIType/order-ruleIType.pipe';
import { OrderRuleSourcePipe } from './order-ruleSource/order-ruleSource.pipe';

import { ProgramArtAreaPipe } from './program-artArea/program-artArea.pipe';
import { ProgramSongTyePipe } from './program-songTye/program-songTye.pipe';
import { ProgramNodesPipe } from './program-nodes/program-nodes.pipe';

import { JumpUserStatusPipe } from './jump-userStatus/jump-userStatus.pipe';
import { PageElementTypePipe } from './page-elementType/page-elementType.pipe';
import { DynamicPipe } from './dynamic-in/dynamic.pipe';
import { AudioSongTypePipe } from './audio-songtype/audio-songType.pipe';
import {VideoSongTypePipe} from './video-songtype/video-songType.pipe';
import {ArtistAreaPipe} from './artist-area/artist-area.pipe';
import {ArtistTypePipe} from './artist-type/artist-type.pipe';
import {DrawSoogTypePipe} from './draw-soogtype/draw-soogType.pipe';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PageEleAttrPipe, PageElementPipe, PagePageGenrePipe, PagePageTypePipe, PageResourcesPipe,
    ProgramFreeFlagPipe, ProgramTypePipe,
    UserCompanyPipe, UserTypePipe,
    GwTaskStatesPipe,
    OrderRuleWeekPipe, OrderRuleITypePipe, OrderRuleSourcePipe,
    ProgramArtAreaPipe, ProgramSongTyePipe, ProgramNodesPipe, JumpUserStatusPipe, PageElementTypePipe, DynamicPipe,
    AudioSongTypePipe, VideoSongTypePipe, ArtistAreaPipe, ArtistTypePipe, DrawSoogTypePipe
  ],
  entryComponents: [],
  exports:      [
    PageEleAttrPipe, PageElementPipe, PagePageGenrePipe, PagePageTypePipe, PageResourcesPipe,
    ProgramFreeFlagPipe, ProgramTypePipe,
    UserCompanyPipe, UserTypePipe,
    GwTaskStatesPipe,
    OrderRuleWeekPipe, OrderRuleITypePipe, OrderRuleSourcePipe,
    ProgramArtAreaPipe, ProgramSongTyePipe, ProgramNodesPipe, JumpUserStatusPipe, PageElementTypePipe, DynamicPipe,
    AudioSongTypePipe, VideoSongTypePipe, ArtistAreaPipe, ArtistTypePipe, DrawSoogTypePipe
  ],
  providers:    [
  ]
})
export class PipeModule {

}
