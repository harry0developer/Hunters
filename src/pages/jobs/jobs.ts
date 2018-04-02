import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { FilterPage } from '../filter/filter';
import { JobDetailsPage } from '../job-details/job-details';
import { DataProvider } from '../../providers/data/data';
import { PostJobsPage } from '../post-jobs/post-jobs';

import 'rxjs/add/operator/debounceTime';
import * as moment from 'moment';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html',
})
export class JobsPage {
  items: any[];
  users: any;
  type: string;
  data: any;
  jobs: any;
  user: any;
  education: any;
  skills: any;
  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;
  experience: any;
  hobbies: any;
  raters: any;
  tmpJobs: any;
  filter: string;
  displayJobsSearch: boolean = false;
  displayUsersSearch: boolean = false;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public events: Events,
    public navParams: NavParams, public dataProvider: DataProvider, public geolocation: Geolocation) {
    this.searchControl = new FormControl();
  }
  
  ionViewDidLoad() {

    this.events.subscribe('location:set', location => {
      this.dataProvider.loadJobs().then(res => {
        let jobs = this.dataProvider.applyHaversine(res, location.lat, location.lng);
        this.jobs = this.dataProvider.sortByDistance(jobs);
      })
    });

    this.user = JSON.parse(localStorage.getItem('user'));
    this.setFilteredJobs();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredJobs();
    });
  }


  init(){
    this.dataProvider.loadJobs().then(res => {
      const location = this.dataProvider.getLatLng();
    })
  }

  setFilteredJobs() {
    this.jobs = this.dataProvider.filterJobs(this.searchTerm);
  }

  getMoment(job) {
    return moment(job.date_created, "MMDDYYYY h:mm").fromNow();
  }

  getJobs() {
    this.dataProvider.loadJobs().then(res => {
      this.jobs = res;
      this.tmpJobs = res;
      this.sortByDate();
    }).catch(err => {
      console.log(err)
    })
  }

  sortByDate() {
    this.jobs.sort(function (a, b) {
      var date1 = new Date(a.date_created).getTime();
      var date2 = new Date(b.date_created).getTime();
      if (date1 > date2) {
        return -1;
      }
      if (date1 < date2) {
        return 1;
      }
      return 0;
    });
  }

  jobDetails(job) {
    this.navCtrl.push(JobDetailsPage, { job: job, user: this.user });
  }

  doRefresh(refresher) {
    this.dataProvider.refreshJobs().then(res => {
      const location = this.dataProvider.getLatLng();
      const jobs = this.dataProvider.applyHaversine(res, location.lat, location.lng);
      this.jobs = this.dataProvider.sortByDistance(jobs);
    })
    refresher.complete();
  }

  onSearchInput() {
    this.searching = true;
  }

  // getLocation(){
  //   this.dataProvider.presentLoading("Getting your location, Please wait...");
  //   const options = {
  //     timeout: 10000,
  //     accuracy: 70
  //   };
  //   this.geolocation.getCurrentPosition(options).then((resp) => {
  //     this.location = {lat:resp.coords.latitude, lng: resp.coords.longitude};
  //     localStorage.setItem("location", JSON.stringify(this.location)); 
  //     this.getJobsWithDistance();
  //     console.log(this.location);
  //     this.dataProvider.dismissLoading();
  //   }).catch((error) => {
  //     if( error.message === "Timeout expired"){
  //       this.location = JSON.parse(localStorage.getItem('location'));
  //       this.getJobsWithDistance();
  //     }
  //     console.log(this.location);
  //     console.log('Error getting location', error);
  //     this.dataProvider.dismissLoading();
  //   }); 
  // }

  // getJobsWithDistance(){
  //   const jobs = this.dataProvider.applyHaversine(this.jobs, this.location.lat, this.location.lng);
  //   this.jobs = this.dataProvider.sortByDistance(jobs);
  // } 

  applyEmployeeFilter() {
    let filter = this.modalCtrl.create(FilterPage, { filter: this.filter });
    filter.onDidDismiss(filter => {
      console.log(filter);
      if (filter != null) {
        this.filter = filter;
        localStorage.setItem('filter', JSON.stringify(filter));
        this.jobs = this.applyFilter(filter);
      }else{ 
        this.dataProvider.loadJobs().then(jobs => {
          this.jobs = jobs;
        })
      }
    });
    filter.present();
  }

  applyFilter(data){ 
    let list: any;
    if(data.type === 'Any'){
      list = this.jobs.filter(job => {
        return job.distance <= data.distance && 
          job.salary >= data.salary.lower && 
          job.salary <= data.salary.upper;
      });
    } else {
      list = this.jobs.filter(job => {
        return job.distance <= data.distance && 
          job.type === data.type &&
          job.salary >= data.salary.lower && 
          job.salary <= data.salary.upper;
      });
    }  
    return list;
  }
}
