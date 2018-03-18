import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserMoreDetailsPage } from './user-more-details';

@NgModule({
  declarations: [
    UserMoreDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserMoreDetailsPage),
  ],
})
export class UserMoreDetailsPageModule {}
