import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController} from 'ionic-angular';
import * as moment from 'moment';
import { DataProvider } from '../../providers/data/data';

import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-job-details',
  templateUrl: 'job-details.html',
})
export class JobDetailsPage {
  job: any;
  user: any; 
  post_time: string;
  profile: any;
  jobs: any;
  jobsApplied: any;
  applied: boolean;
  hasViewed: boolean = false;
  didView: boolean;
  viewedJobs: any;
  countViews: number = 0;
  countShared: number = 0;
  countApplied: number;
  constructor(public navCtrl: NavController, public ionEvent: Events,  public actionSheetCtrl: ActionSheetController,
    public dataProvider: DataProvider, public navParams: NavParams, private socialSharing: SocialSharing) { 
    this.profile = JSON.parse(localStorage.getItem("user"));
    this.applied = false;
   
     
  }
    
  ionViewDidLoad(){
    this.job = this.navParams.get('job');
    this.user = this.navParams.get('user');
    this.hasApplied();
    this.post_time = moment(this.job.date_created, "YYYYMMDD").fromNow();  
    this.didView = false;
    this.hasViewedJob();
  }


  applyNow(job, emp){
    let data = {
      user_id_fk: this.profile.user_id,
      job_id_fk: job.job_id, 
      employer_id_fk: job.user_id_fk,
      date_applied: new Date()
    }
    this.dataProvider.postData(data, 'addJobToApplicants').then(res => {
      let results;
      results = res;
      if(results && results.data){
        this.dataProvider.appliedJobs = null;
        this.ionEvent.publish("user:applied", results.data);
        this.hasApplied();
        console.log(res);
      }else{
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    })
  }


  deleteApplication(job){
    let data = { 
      user_id_fk: this.profile.user_id,
      employer_id_fk: job.user_id_fk,
      job_id_fk: job.job_id
    }
    console.log(data);
  }

  withdrawApplication(job){
    let data = { 
      user_id_fk: this.profile.user_id,
      employer_id_fk: job.user_id_fk,
      job_id_fk: job.job_id
    }
    this.dataProvider.postData(data, 'removeJobFromApplicants').then(res => {
      let results;
      results = res;
      let arr = {};
      if(results && results.data){
        this.dataProvider.appliedJobs = null;
        this.ionEvent.publish("user:applied", results.data);
        this.countAppliedUsers(results.data);
        this.applied = !this.applied;
      } 
      else{ 
          console.log(res);
      }
    }).catch(err => {
      console.log(err);
    })
  }

  getSkills(skills){
    return skills.split(",");
  }

  
  countAppliedUsers(list){
    let counter = 0;
    list.forEach(job => {
      if(job.job_id_fk == this.job.job_id){
        counter++;
      }
    });

    this.countApplied = counter;
  }

  hasApplied(){ 
    this.dataProvider.loadAppliedJobs().then(res => {
      this.jobsApplied = res;
      this.countAppliedUsers(res);
      res.forEach(aJob => {
        if(aJob.job_id_fk == this.job.job_id && this.profile.user_id == aJob.user_id_fk){
          this.applied = true;
          console.log("You applied for "+ this.job.title);
        }
      });
    });
  }
 
 hasViewedJob(){
  this.dataProvider.loadViewedJobs().then(res => {
    this.viewedJobs = res;
    if(res && this.viewedJobs.length > 0){
      for(let i=0; i<this.viewedJobs.length; i++){
        if(res[i].job_id_fk == this.job.job_id && this.profile.user_id == res[i].user_id_fk){
          console.log("Viewed job");
          this.didView = true;
          this.countJobViews(res);
        }
      }
      if(!this.didView){
        this.addToViewedHelper();
      }
    }
    else{
      this.addToViewedHelper();
    }
  })
 }


  addToViewedHelper(){
    let data = {
      user_id_fk: this.profile.user_id,
      job_id_fk: this.job.job_id,
      date_viewed: this.dataProvider.getDate()
    }
    this.dataProvider.postData(data, "addToJobViews").then(res => {
      let data =  res;
      this.viewedJobs = res;
      this.countJobViews(res);
      console.log(res);
    })
  }
  

  addToSharedJobs(data){
    this.dataProvider.postData(data, "addToSharedJobs").then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  }

  countJobViews(vJobs){
    if(vJobs && vJobs.length > 0){
      vJobs.forEach(vJob => {
        if(vJob.job_id_fk == this.job.job_id){
          this.countViews++;
        }
      });
      console.log(this.countViews);
    }else{
      console.log("No one viewed this job");
    }
  }

 
  shareJobActionSheet(job){
    let data = {
      job_id_fk: job.job_id,
      user_id_fk: this.profile.user_id,
      date_shared: this.dataProvider.getDate()
    };


    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share this job',
      buttons: [
        {
          text: 'Facebook',
          icon:'logo-facebook',
          handler: () => {//
            this.socialSharing.shareViaFacebook(job, "img.png", "www.job.co.za").then(res => {
              console.log(res);
              this.addToSharedJobs(data);
              
            }).catch(err => {
              console.log(err);
            })
          }
        },
        {
          text: 'Twitter',
          icon: 'logo-twitter',
          handler: () => {
            this.socialSharing.shareViaTwitter(job, "img.png", "www.job.co.za").then(res => {
              console.log(res);
              this.addToSharedJobs(data);
              
            }).catch(err => {
              console.log(err);
            })
          }
        },
        {
          text: 'Email',
          icon: 'home',
          handler: () => {
            console.log(job);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.socialSharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then((res) => {
              console.log(res);
              this.addToSharedJobs(data);
              
            }).catch((err) => {
              console.log(err);
            });
          }
        }
      ]
    });
    actionSheet.present();
  }
 

}
