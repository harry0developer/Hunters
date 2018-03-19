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


  postJob(){
    this.dataProvider.presentLoading("Please wait...");
    let res;  
    this.data = {title:"Plumber urgently", type:"Part-time", tagline:"Our bathroom is leaking, please help!", 
    category: "Plumbing", description:"A professional plumber is needed asap and we pay good money. All the bathrooms need rework", 
    offer:"400 p/d", date_created:"2018-01-18", email:"hanni@test.com", phone:"0823340000", address:"Plain str, Wettown, Cape Town", user_id: 2};
    this.dataProvider.postData(this.data, "addJob").then((result) => {
      // console.log(result);
      res = result;
      if(res && res.error){
        // console.log(res.error);
        this.dataProvider.dismissLoading();
        this.dataProvider.presentAlert("Post failed", res.error.text);
      }else{ 
        // console.log(res);
        this.dataProvider.dismissLoading();
      }
    }).catch(err => {
      // console.log(err);
      this.dataProvider.dismissLoading();
    })
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
    console.log(this.candidates);
    console.log(filter);
    let list = this.candidates.filter(candidate => candidate.title.toLowerCase() == filter.toLowerCase());
    return list;
  }
 

  userDetails(user){
    
    let userExperience = this.getUserExperience(user);
    let userSkills = this.getUserSkills(user);
    let userEducation = this.getUserEducation(user);
    
    console.log(userExperience);
    console.log(userSkills);
    console.log(userEducation);

    this.navCtrl.push(UserDetailsPage, {user: user, page: "Candidates"});
  }
 

  
  getUserExperience(user){
    let ex = [];
    this.experience.forEach(exp => {
      if(exp.user_id_fk == user.user_id){
        ex.push(exp);
      }
    });
    return ex;
  }

  getUserSkills(user){
    let sk = [];
    this.skills.forEach(skill => {
      if(skill.user_id_fk == user.user_id){
        sk.push(skill);
      }
    });
    return sk;
    
  }
  
  getUserEducation(user){
    let ed = [];
    this.education.forEach(edu => {
      if(edu.user_id_fk == user.user_id){
        ed.push(edu);
      }
    });
    return ed;
  }

  getMoment(job){
    return moment(job.date_created, "YYYYMMDD").fromNow();  
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
    return moment(user.lastSeen, "YYYYMMDD").fromNow();  
  }
  
}
