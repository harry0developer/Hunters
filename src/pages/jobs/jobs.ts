import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { FilterPage } from '../filter/filter';
import { UserDetailsPage } from '../user-details/user-details';
import { JobDetailsPage } from '../job-details/job-details';
import { LoginPage } from '../login/login';
import { DataProvider } from '../../providers/data/data';
import 'rxjs/add/operator/debounceTime';
import * as moment from 'moment';
import { PostJobsPage } from '../post-jobs/post-jobs';

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
  profile: any;
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
    public navParams: NavParams, public dataProvider: DataProvider) {
    this.searchControl = new FormControl();

  }

  ionViewDidLoad() {
    this.init()
    this.getJobs();
    this.profile = JSON.parse(localStorage.getItem('user'));
    this.setFilteredJobs();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredJobs();
    });
  }

  init() {
    this.dataProvider.loadEducation().then(edu => {
      this.education = edu;
    }).catch(e => {
      console.log(e);
    });

    this.dataProvider.loadExperiences().then(exp => {
      this.experience = exp;
    }).catch(e => {
      console.log(e);
    });

    this.dataProvider.loadSkills().then(skillz => {
      this.skills = skillz;
    }).catch(e => {
      console.log(e);
    });
  }

  setFilteredJobs() {
    this.jobs = this.dataProvider.filterJobs(this.searchTerm);
  }

  getMoment(job) {
    return moment(job.date_created, "YYYYMMDD").fromNow();
  }

  postJob() {
    let postModal = this.modalCtrl.create(PostJobsPage, { profile: this.profile });
    postModal.onDidDismiss(data => {
      if (data != null) {
        this.jobs = data;
        this.sortByDate();
        this.dataProvider.presentToast("Job posted successfully");
      }
    });
    postModal.present();
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
    this.navCtrl.push(JobDetailsPage, { job: job, user: this.profile });
  }

  doRefresh(refresher) {
    let jobs = this.dataProvider.refreshJobs();
    this.jobs = jobs;
    refresher.complete();
  }

  onSearchInput() {
    this.searching = true;
  }

  share(job) {
    this.dataProvider.shareActionSheet(job);
  }

  applyEmployeeFilter() {
    this.jobs = this.tmpJobs;
    let filter = this.modalCtrl.create(FilterPage, { filter: this.filter });
    filter.onDidDismiss(filter => {
      if (filter != null) {
        this.jobs = this.getJobsByFilter(filter);
      }
    });
    filter.present();
  }

  getJobsByFilter(filter) {
    let list = this.jobs.filter(job => job.category.toLowerCase() == filter.toLowerCase());
    return list;
  }

}
