import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events, IonicPage } from 'ionic-angular';
import { FormControl } from '@angular/forms';

import { FilterPage } from '../filter/filter';
import { UserDetailsPage } from '../user-details/user-details';
import { DataProvider } from '../../providers/data/data';
import 'rxjs/add/operator/debounceTime';
import * as moment from 'moment';


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

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public events: Events,
    public navParams: NavParams, public dataProvider: DataProvider) {
    this.searchControl = new FormControl();
    this.init()
  }
  
  
  ionViewDidLoad() {  
    this.profile = JSON.parse(localStorage.getItem('user')); 
    this.setFilteredUsers();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.setFilteredUsers();
    });
  }


  init(){
    this.dataProvider.loadUsers().then(users => {
      this.candidates = users.filter(user => user.type == 'Employee');
    }).catch(e => {
      console.log(e);
    });
  }

  setFilteredUsers(){
    let candidates = this.dataProvider.filterUsers(this.searchTerm);
    if(candidates){
      this.candidates = candidates.filter(user => user.type == 'Employee');
      this.tmpCandiates = this.candidates;
    }else{
      this.dataProvider.loadUsers().then(res => {
        this.candidates = res.filter(user => user.type == 'Employee');
        this.tmpCandiates = this.candidates;
      }).catch(err => {
        console.log(err);
      })
    }
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
 
  doRefresh(refresher) {
    let users = this.dataProvider.refreshUsers();
    this.candidates = users;
    refresher.complete();
  }

  onSearchInput(){
    this.searching = true;
  }

  getLastSeen(user){
    return moment(user.lastSeen.split(" ")[0], "MMDDYYYY").fromNow();  
  }
  
}
