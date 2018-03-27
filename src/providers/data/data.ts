import { Headers, Http  } from '@angular/http';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController ,AlertController, ActionSheetController, Events} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import 'rxjs/add/operator/map';
import * as moment from 'moment';

// let apiUrl = 'http://moralemedia.co.za/eventon/api/';
// let uploads = 'http://moralemedia.co.za/eventon/api/uploads/';
let apiUrl = 'http://localhost/Hunters/api/';
let uploads = 'http://localhost/Hunters/api/uploads';

@Injectable()
export class DataProvider {
  loadSpinner: any;
  uploads: string = 'http://localhost/Hunters/api/uploads/';
  users: any = [];
  experiences: any = [];
  data: any;
  usersData: any;
  experienceData: any;
  skills: any;
  education: any;
  nationalities: any;
  titles:any;
  jobs: any;
  myJobs: any;
  appliedJobs: any;
  hobbies: any;
  appointments: any = [];
  raters: any;
  ratings: any;
  viewedJobs: any;
  categories: any;
  constructor(public http: Http, public loadingCtrl: LoadingController, public events: Events,
    public alertCtrl: AlertController, public toastCtrl: ToastController, 
    private actionSheetCtrl: ActionSheetController, private geolocation: Geolocation ) {
      this.usersData = null;
      this.experienceData = null;
      this.users = null;
      this.skills = null;
      this.nationalities = null;
      this.jobs = null;
      this.myJobs = null;
      this.hobbies = null;
      this.appointments = null;
      this.raters = null;
      this.appliedJobs = null;
      this.categories = null;
    }
    
 
  getMediaLink(){
    return this.uploads;
  }
  
  loadUsers() {
    if (this.users) {
      return Promise.resolve(this.users);
    }
    return new Promise(resolve => {
      let headers = new Headers();
      this.http.post(apiUrl + 'getUsers', null ,{headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.users = data.data;
          resolve(this.users);
        });
    });
  }

 


  loadSkills() {
    if (this.skills) {
      return Promise.resolve(this.skills);
    }
    return new Promise(resolve => {
      let headers = new Headers();
      this.http.post(apiUrl + 'getSkills', null ,{headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.skills = data.data;
          resolve(this.skills);
        });
    });
  }

  loadEducation() {
    if (this.education) {
      return Promise.resolve(this.education);
    }
    return new Promise(resolve => {
      let headers = new Headers();
      this.http.post(apiUrl + 'getEducation', null ,{headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.education = data.data;
          resolve(this.education);
        });
    });
  }

 

  loadExperiences() {
    if (this.experienceData) {
      return Promise.resolve(this.experienceData);
    }
    return new Promise(resolve => {
      let headers = new Headers();
      this.http.post(apiUrl + 'getExperiences', null ,{headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.experienceData = data.data;
          resolve(this.experienceData);
        });
    });
  }

 
  loadAppointments() {
    if (this.appointments) {
      return Promise.resolve(this.appointments);
    }
    return new Promise(resolve => {
      let headers = new Headers();
      this.http.post(apiUrl + 'getAppointments', null ,{headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.appointments = data.data;
          resolve(this.appointments);
        });
    });
  }

  loadJobs() {
    if (this.jobs) {
      return Promise.resolve(this.jobs);
    }
    return new Promise(resolve => {
      let headers = new Headers();
      this.http.post(apiUrl + 'getJobs', null ,{headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.jobs = data.data;
          resolve(this.jobs);
        });
    });
  }

  loadMyPostedJobs(userId) {
    if (this.myJobs) {
      return Promise.resolve(this.myJobs);
    }
    return new Promise(resolve => {
      let headers = new Headers();
      this.http.post(apiUrl + 'getMyPostedJobs', {user_id: userId} ,{headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.jobs = data.data;
          resolve(this.jobs);
        });
    });
  }

  loadViewedJobs() {
    // if (this.viewedJobs) {
    //   return Promise.resolve(this.viewedJobs);
    // }
    return new Promise(resolve => {
      let headers = new Headers();
      this.http.post(apiUrl + 'getViewedJobs', null ,{headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.viewedJobs = data.data;
          resolve(this.viewedJobs);
        });
    });
  }



  loadAppliedJobs() {
    if (this.appliedJobs) {
      return Promise.resolve(this.appliedJobs);
    }
    return new Promise(resolve => {
      let headers = new Headers();
      this.http.post(apiUrl + 'getAppliedJobs', null ,{headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.appliedJobs = data.data;
          resolve(this.appliedJobs);
        });
    });
  }
 
  loadRaters() {
    if (this.raters) {
      return Promise.resolve(this.raters);
    }
    return new Promise(resolve => {
      let headers = new Headers();
      this.http.post(apiUrl + 'getRaters', null ,{headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.raters = data.data;
          resolve(this.raters);
        });
    });
  }

  loadSharedJobs() {
    if (this.raters) {
      return Promise.resolve(this.raters);
    }
    return new Promise(resolve => {
      let headers = new Headers();
      this.http.post(apiUrl + 'getSharedJobs', null ,{headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.raters = data.data;
          resolve(this.raters);
        });
    });
  }

  getCountries() {
    if (this.nationalities) {
      return Promise.resolve(this.nationalities);
    }
    return new Promise(resolve => {
      this.http.get('../../assets/countries.json' )
        .map(res => res.json())
        .subscribe(data => {
          this.nationalities = data;
          resolve(this.nationalities);
        });
    });
  }


 
  getTitles() {
    if (this.titles) {
      return Promise.resolve(this.titles);
    }
    return new Promise(resolve => {
      this.http.get('../../assets/titles.json' )
        .map(res => res.json())
        .subscribe(data => {
          this.titles = data;
          resolve(this.titles);
        });
    });
  }

  getCategories() {
    if (this.categories) {
      return Promise.resolve(this.categories);
    }
    return new Promise(resolve => {
      this.http.get('../../assets/categories.json' )
        .map(res => res.json())
        .subscribe(data => {
          this.categories = data;
          resolve(this.categories);
        });
    });
  }
 

  getLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
     });
  }

  refreshUsers(){ 
    return this.users;
  }
  
  refreshJobs(){ 
    return this.jobs;
  }

  postData(credentials, type) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.http.post(apiUrl + type, JSON.stringify(credentials), {headers: headers})
        .map(resp => resp.json()).subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

 
  
  getUserEducation(user){
    let userEdu = [];
    if(this.education){
      this.education.forEach(edu => {
        if(edu.user_id_fk == user.user_id){
          userEdu.push(edu);
        }
      }); 
    }

    return userEdu;
  }



  getUserExperience(user){
    let userExp = [];
    if(this.experiences){
      this.experiences.forEach(exp => {
        if(exp.user_id_fk == user.user_id){
          userExp.push(exp);
        }
      }); 
    }
    return userExp;
  }

  getUserSkills(user){
    let userSkills = [];
    if(this.skills){
      this.skills.forEach(skill => {
        if(skill.user_id_fk == user.user_id){
          userSkills.push(skill);
        }
      }); 
    }
    return userSkills;
  }
 
  groupExp(user, skills){
    if(skills){
      let list: any = [];
      skills.forEach(ex => {
        if(ex.user_id_fk == user.user_id){
          list.push(ex);
        }
      });
      return list;
    }
  
  }

  mapper(users, skills): any{ 
    let list: any = [];
    let userObj: any;
    users.forEach(user => {
      userObj = this.groupExp(user, skills);
      if(userObj){
        user.skills = userObj;
        list.push(user);
      }
    });
    return list;
  }
 
 
  filterUsers(searchTerm){ 
    if(this.users){
      let name: string;
      return this.users.filter((user) => {
        name = user.firstname+ " " +user.lastname;
        return name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });    
    }
  }

  filterJobs(searchTerm){ 
    if(this.jobs){
      return this.jobs.filter((job) => {
        return job.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });    
    }
  }


 
  getLink(){
    return this.uploads;
  }

  getData(type) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.http.post(apiUrl + type, null ,{headers: headers})
        .map(resp => resp.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


  //Adders ===========

  presentLoading(msg) {
    this.loadSpinner = this.loadingCtrl.create({
      content: msg
    });
    this.loadSpinner.present();
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  presentAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      cssClass: "btn",
      buttons: ['Dismiss']
    });
    alert.present();
  }

  dismissLoading() {
    this.loadSpinner.dismiss();
  }


  shareActionSheet(job) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share this job',
      buttons: [
        {
          text: 'Facebook',
          icon:'logo-facebook',
          handler: () => {
            console.log(job);
          }
        },
        {
          text: 'Twitter',
          icon: 'logo-twitter',
          handler: () => {
            console.log(job);
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
            console.log('Cancel clicked');
          }
        }
      ]
    });
 
    actionSheet.present();
  }

  getDate(){
    var date = moment.now();
    return moment(date).format("MM/DD/YYYY HH:mm");
  }
 
}
