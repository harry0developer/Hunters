import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { JobDetailsPage } from '../job-details/job-details';
import { StatsPage } from '../stats/stats';

@IonicPage()
@Component({
  selector: 'page-my-jobs',
  templateUrl: 'my-jobs.html',
})
export class MyJobsPage {
  data: any;
  jobs: any;
  users: any;
  myJobs: any = [];
  profile: any;
  appliedJobs: any;
  postedJobs: any;
  viwedJobs: any;
  constructor(public navCtrl: NavController,public ionEvents: Events, public dataProvider: DataProvider, public navParams: NavParams) {
    this.profile = JSON.parse(localStorage.getItem("user"));
    this.getAllJobs();  
    this.getAllUsers();  
    // this.getViewedJobs();
  }
  
  ionViewDidLoad() { 
    this.getAllJobs();
    this.getAllUsers();  
    this.getMyPostedJobs();
    this.ionEvents.subscribe("user:applied", (res) => {
      this.getAppliedJobs(res);  
    });
 
   
  }
 
 
  getViewedJobs(){
    this.dataProvider.loadViewedJobs().then(res => {
      this.viwedJobs = res;
    })
  }

  mapJobs(jobs, aJobs){
    let list = [];
    if(this.profile.type == "Employee"){
      jobs.forEach(job => {
        aJobs.forEach(aJob => {
          if(job.job_id == aJob.job_id_fk && aJob.user_id_fk == this.profile.user_id){
            list.push(job);
          }
        }); 
      });
      return list;
    }
    else if(this.profile.type == "Employer"){
      jobs.forEach(job => {
        aJobs.forEach(aJob => {
          if(job.job_id == aJob.job_id_fk && aJob.employer_id_fk == this.profile.user_id){
            list.push(job);
          }
        }); 
      });
      return list;
    }

  }

 
  getMyPostedJobs(){
    let list = [];
    this.dataProvider.loadJobs().then(res => {
      this.jobs = res;
      res.forEach(job => {
        if(job.user_id_fk == this.profile.user_id){
          job.viewedUsers = this.countJobViews(job);
          job.appliedUsers = this.countApplied(job);
          list.push(job);
        }
      });
      this.postedJobs = list;
    })
  }

  countJobViews(job){
    let views;
    let vJobs = [];
    let users = [];
    this.dataProvider.loadViewedJobs().then(res => {
      views = res;
      views.forEach(vJob => {
        if(job.job_id == vJob.job_id_fk){
          vJobs.push(vJob)
        }
      });
      if(this.users){
        this.users.forEach(user => {
          vJobs.forEach(vUsa => {
            if(vUsa.user_id_fk == user.user_id){
              users.push(user);
            }
          })
        });
      }
    });
    return users;
  }

  countApplied(job){
    let aJobs = [];
    let users = [];
    this.dataProvider.loadAppliedJobs().then(res => {
      res.forEach(aJob => {
        if(job.job_id == aJob.job_id_fk){
          aJobs.push(aJob)
        }
      });
      if(aJobs){
        aJobs.forEach(aUser => {
         this.users.forEach(user => {
            if(aUser.user_id_fk == user.user_id){
              users.push(user);
            }
         });
        });
      }
      job.appliedUsers = users;
      return job;
    });
    return job;
  }

  getAllJobs(){
    this.dataProvider.loadJobs().then(all => {
      this.jobs = all;
      
      this.dataProvider.loadAppliedJobs().then(app => {
        this.appliedJobs = app;
        this.myJobs = this.mapJobs(all,app);
      });
      
    })
  }

  getAllUsers(){
    this.dataProvider.loadUsers().then(res => {
      this.users = res;
    })
  }

  getAppliedJobs(res){
    this.dataProvider.loadJobs().then(all => {
      this.jobs = all;
      this.myJobs = this.mapJobs(all, res);
    })
  }
 
 

  jobDetails(job){
    if(this.profile.type == "Employee"){
      this.navCtrl.push(JobDetailsPage, {job:job});
    }else{
      this.navCtrl.push(StatsPage, {job:job, users: this.users});
    }
  }
 
  
}
