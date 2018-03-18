import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalDetailsPage } from './personal-details';

@NgModule({
  declarations: [
    PersonalDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalDetailsPage),
  ],
})
export class PersonalDetailsPageModule {}
