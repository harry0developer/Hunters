import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CandidatesPage } from './candidates';

@NgModule({
  declarations: [
    CandidatesPage,
  ],
  imports: [
    IonicPageModule.forChild(CandidatesPage),
  ],
})
export class CandidatesPageModule {}
