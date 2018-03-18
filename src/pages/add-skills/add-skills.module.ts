import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSkillsPage } from './add-skills';

@NgModule({
  declarations: [
    AddSkillsPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSkillsPage),
  ],
})
export class AddSkillsPageModule {}
