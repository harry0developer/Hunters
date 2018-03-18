import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { FormControl } from '@angular/forms';

import { FilterPage } from '../filter/filter';
import { UserDetailsPage } from '../user-details/user-details';
import { JobDetailsPage } from '../job-details/job-details';
import { LoginPage } from '../login/login';

import { DataProvider } from '../../providers/data/data';
import 'rxjs/add/operator/debounceTime';
import * as moment from 'moment';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html' 
})
export class HomePage {
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
    // let data = {firstname:"", lastname:"", dob:"", gender:"", nationality:"", race:"", phone:"", address:"", type: "Employer"};
  //  this.profile = this.navParams.get('data');
   console.log(this.profile);
    if(this.profile && this.profile.type && this.profile.type == "Employee"){
      this.setFilteredJobs();
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.setFilteredJobs();
      });
    }
    else if(this.profile && this.profile.type && this.profile.type == "Employer"){
      this.setFilteredUsers();
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
          this.searching = false;
          this.setFilteredUsers();
      });
    }else{
      console.log("No user profile");
      localStorage.clear();
      this.navCtrl.setRoot(LoginPage);
    }
  } 


  init(){
    this.dataProvider.loadUsers().then(users => {
      let usa = [];
      users.forEach(user => {
        if(user && user.type != 'Employer'){
          usa.push(user);
        }
      });
      this.users = usa;
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

  insert(){
    let data = {
      firstname: "Maphuti",
      lastname: "Seroka",
      dob: "1979-02-02",
      race: "Black",
      nationality: "South African",
      gender: "Female",
      type: "Employee",
      email: "mseroka@test.com",
      password: "123456",
      phone: "0719090901",
      address: "565 Greenfild Str, Adellay ,Hillbrow, 2000"
    }
    this.dataProvider.postData(data, "signup").then(res => {
      console.log(res);  
    }).catch(e => {
      console.log(e);
    })
  }

  setFilteredUsers(){
    let users = this.dataProvider.filterUsers(this.searchTerm);
    if(users){

      let usa = [];
      
      users.forEach(user => {
        if(user && user.type != 'Employer'){
          usa.push(user);
        }
      });
      this.users = usa;
    }
  }

  setFilteredJobs() {
    this.jobs = this.dataProvider.filterJobs(this.searchTerm);
  }

 

  toggleSearch(){
    if(this.type.toLocaleLowerCase() == "users"){
      this.displayUsersSearch = !this.displayUsersSearch;
    }
    else{
      this.displayJobsSearch = !this.displayJobsSearch
    }
  }
 

  userDetails(user){
    let userExperience = this.getUserExperience(user);
    let userSkills = this.getUserSkills(user);
    let userEducation = this.getUserEducation(user);
    this.navCtrl.push(UserDetailsPage, {user: user, page:'HomePage'});
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

  getJobs(){
    this.dataProvider.loadJobs().then(res => {
      this.jobs = res;
      // console.log(res);
    }).catch(err => {
      // console.log(err);
    })
  }

  jobDetails(job){
      this.navCtrl.push(JobDetailsPage, {job:job, user: this.profile});
  }


  presentFilterModal() {
    // let filterModal = this.modalCtrl.create(FilterPage, {type: this.type});
    // filterModal.onDidDismiss(data => {
    //   this.type = data;
    // });
    // filterModal.present();
  }
 


  doRefresh(refresher) {
    let users = this.dataProvider.refreshUsers();
    // console.log(users);
    this.users = users;
    refresher.complete();
  }
  

  onSearchInput(){
    this.searching = true;
  }


  share(job){
    // console.log("Sahre")
    this.dataProvider.shareActionSheet(job);
  }

 


}
