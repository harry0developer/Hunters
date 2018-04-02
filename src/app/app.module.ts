import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { AddSkillsPage } from '../pages/add-skills/add-skills';
import { AppointmentsPage } from '../pages/appointments/appointments';
import { AutocompletePage } from '../pages/autocomplete/autocomplete';
import { CandidatesPage } from '../pages/candidates/candidates';
import { FilterPage } from '../pages/filter/filter';
import { JobDetailsPage } from '../pages/job-details/job-details';
import { JobsPage } from '../pages/jobs/jobs';
import { LoginPage } from '../pages/login/login';
import { MyJobsPage } from '../pages/my-jobs/my-jobs';
import { OtpPage } from '../pages/otp/otp';
import { PostJobsPage } from '../pages/post-jobs/post-jobs';
import { SignupPage } from '../pages/signup/signup';
import { StatsPage } from '../pages/stats/stats';
import { SetupPage } from '../pages/setup/setup';
import { TermsPage } from '../pages/terms/terms';
import { UserDetailsPage } from '../pages/user-details/user-details';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { ProfilePage } from '../pages/profile/profile';
import { FilterCandidatesPage } from '../pages/filter-candidates/filter-candidates';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataProvider } from '../providers/data/data';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp,
    AppointmentsPage,
    FilterPage,
    UserDetailsPage,
    EditProfilePage,
    AddSkillsPage,
    LoginPage,
    SignupPage,
    OtpPage,
    TermsPage,
    PostJobsPage,
    AutocompletePage,
    JobDetailsPage,
    StatsPage,
    MyJobsPage,
    SetupPage,
    FilterCandidatesPage,
    CandidatesPage,
    ProfilePage,
    JobsPage, 
  ],
  imports: [
    BrowserModule, 
    HttpModule, 
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [

    MyApp,
    AppointmentsPage,
    FilterPage,
    UserDetailsPage,
    EditProfilePage,
    AddSkillsPage,
    LoginPage,
    SignupPage,
    OtpPage,
    TermsPage,
    PostJobsPage,
    AutocompletePage,
    JobDetailsPage,
    StatsPage,
    MyJobsPage,
    SetupPage,
    FilterCandidatesPage,
    CandidatesPage,
    ProfilePage,
    JobsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    Geolocation,
    File,
    FileTransfer,
    Camera,
    FilePath,
    SocialSharing,
  ]
})
export class AppModule {}