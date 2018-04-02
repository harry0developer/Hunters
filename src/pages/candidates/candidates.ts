import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events, IonicPage } from 'ionic-angular';
import { FormControl } from '@angular/forms';

import { FilterPage } from '../filter/filter';
import { UserDetailsPage } from '../user-details/user-details';
import { DataProvider } from '../../providers/data/data';
// import 'rxjs/add/operator/debounceTime';
// import * as moment from 'moment';
import { PostJobsPage } from '../post-jobs/post-jobs';
import { FilterCandidatesPage } from '../filter-candidates/filter-candidates';


@IonicPage()
@Component({
  selector: 'page-candidates',
  templateUrl: 'candidates.html',
})
export class CandidatesPage {
  items: any[];
  users: any;
  
  type: string;

  data: any;
  
  profile: any;
  education: any;
  skills: any;
  searchTerm: string = '';
  searchControl: FormControl; 
  searching: any = false;
  experience: any;
  hobbies: any;
  raters: any;
  candidates: any;
  tmpCandiates: any;
  
  displayJobsSearch: boolean = false;
  displayUsersSearch: boolean = false;
  filter: any;
  jobs: any;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public events: Events,
    public navParams: NavParams, public dataProvider: DataProvider) {
    this.searchControl = new FormControl();
  }
  
  
  ionViewDidLoad() {  
    this.profile = JSON.parse(localStorage.getItem('user')); 
    this.events.subscribe('location:set', location => {
      this.dataProvider.loadUsers().then(res => {
        let candidates = this.dataProvider.applyHaversine(res, location.lat, location.lng);
        let newC = this.getCandidatesOnly(candidates);
        this.candidates = this.dataProvider.sortByDistance(newC);
        this.tmpCandiates = this.candidates;
      })
    });
    this.setFilteredUsers();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.setFilteredUsers();
    });
  }

  setFilteredUsers() {
    this.candidates = this.dataProvider.filterUsers(this.searchTerm);
  }

  getCandidatesOnly(candidates): any{
     return candidates.filter(user => user.type === 'Employee');
  }
  
 
  applyEmployerFilter(){ 
    this.candidates = this.tmpCandiates;
    let filter = this.modalCtrl.create(FilterPage);
    filter.onDidDismiss(filter => {
      if(filter != null){
        this.candidates = this.getCandidatesByFilter(filter);
      }
    });
    filter.present();
  }
  
  getCandidatesByFilter(filter){
    let list = this.candidates.filter(candidate => candidate.title.toLowerCase() == filter.toLowerCase());
    return list;
  }

  userDetails(user){ 
    this.navCtrl.push(UserDetailsPage, {user: user, page: "Candidates"});
  }

  postJob() {
    let postModal = this.modalCtrl.create(PostJobsPage, { profile: this.profile });
    postModal.onDidDismiss(data => {
      if (data != null) { 
        this.dataProvider.loadJobs().then(res => this.jobs = res);
        this.dataProvider.presentToast("Job posted successfully");
      }else{
        this.dataProvider.presentToast("Oops something went wrong, try again later");
      }
    });
    postModal.present();
  }
 
  doRefresh(refresher) {
    this.dataProvider.refreshUsers().then(res => {
      const location = this.dataProvider.getLatLng();
      const candidates = this.dataProvider.applyHaversine(res, location.lat, location.lng);
      this.candidates = this.dataProvider.sortByDistance(candidates);
    })
    refresher.complete();
  }

  onSearchInput(){
    this.searching = true;
  }
  
  filterCandidates(){
    this.candidates = this.tmpCandiates;
    let filter = this.modalCtrl.create(FilterCandidatesPage, { filter: this.filter });
    filter.onDidDismiss(filter => {
      if (filter != null) {
        this.filter = filter;
        localStorage.setItem('filter', JSON.stringify(filter));
        this.candidates = this.applyFilter(filter);
      }else{ 
        this.dataProvider.loadUsers().then(users => {
          this.candidates = users;
        })
      }
    });
    filter.present();
  }

  applyFilter(data){ 
    let list: any;
    list = this.candidates.filter(user => {
      return user.distance <= data.distance && user.title === data.title
    });
    return list;
  }

}
