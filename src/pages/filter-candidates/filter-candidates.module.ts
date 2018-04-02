import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterCandidatesPage } from './filter-candidates';

@NgModule({
  declarations: [
    FilterCandidatesPage,
  ],
  imports: [
    IonicPageModule.forChild(FilterCandidatesPage),
  ],
})
export class FilterCandidatesPageModule {}
