import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyJobsPage } from './my-jobs';

@NgModule({
  declarations: [
    MyJobsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyJobsPage),
  ],
})
export class MyJobsPageModule {}
