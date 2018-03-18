import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostJobsPage } from './post-jobs';

@NgModule({
  declarations: [
    PostJobsPage,
  ],
  imports: [
    IonicPageModule.forChild(PostJobsPage),
  ],
})
export class PostJobsPageModule {}
