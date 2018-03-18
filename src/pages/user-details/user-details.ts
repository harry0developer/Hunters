import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { UserMoreDetailsPage } from '../user-more-details/user-more-details';
// import * as moment from 'moment';

 import { DataProvider } from '../../providers/data/data';


@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {
    
  data:any = [];
  personal: any;
  education: any;
  experience: any;
  skills: any;
  hobbies: any;
  profile: any; //me
  user: any; //current viewed profile
  page: string;
  ratings: any;

  raters: any = [];
  rateState: string;

  applied: boolean;
  
  constructor(public navCtrl: NavController, public dataProvider: DataProvider, public ionEvents: Events,
    public modalCtrl: ModalController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    /**
     * 0-20% - 1
     * 21-40% - 2
     * 41-60% - 3
     * 61-80% - 4
     * 81-100% - 5
     */
   

    this.user = this.navParams.get('user');
    this.profile = JSON.parse(localStorage.getItem('user'));
    this.page = this.navParams.get('page');
    
    this.skills = this.dataProvider.getUserSkills(this.user);
    this.experience = this.dataProvider.getUserExperience(this.user);
    this.education = this.dataProvider.getUserEducation(this.user);
    
    this.dataProvider.loadRaters().then(res => {
      this.raters = res;
      this.rateState = this.hasRated(this.user);
    });


    this.hasBeenHired();
 
  }

  checkRates(user, rate){
    let rated: boolean = false;
    if(this.raters){
      this.raters.forEach(r => {
        if(r.rater_id == this.profile.user_id && r.user_id == user.user_id){
          let data = { rate: rate, date_rated: new Date(), rating_id: r.rating_id };
          this.rateUser(data, 'updateRatings');
          rated = true;
        }
      });
      if(!rated){
        let data = { rater_id: this.profile.user_id, user_id: user.user_id, rate: rate, date_rated: new Date()};
        this.rateUser(data, 'newRatings');
      }
    }
  }

  rateUser(data, op){
    
    this.rateState = data.rate ;
   
    this.dataProvider.postData(data, op).then(res => {
      let result;
      result = res;
      if(res && result.data){
        this.raters = result.data;
      }else{
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });

  }
 
  loadUserMoreDetails(cat){
    let contactModal = this.modalCtrl.create(UserMoreDetailsPage, {user: this.user, experience: this.experience, education: this.education, skills: this.skills, category: cat});
    contactModal.present();
  }
 
 

  hasRated(user){
    if(this.raters){
      for(var i=0; i<this.raters.length; i++){
        if(this.profile.user_id ==  this.raters[i].rater_id && user.user_id == this.raters[i].user_id){
         return this.raters[i].rate;
        }
      }
    }
    return 'not rated';
  }
  

 
  offerUserEmployment(user){
    this.dataProvider.presentLoading("Please wait...");
    let data = { 
      employer_id_fk: this.profile.user_id, 
      user_id_fk: user.user_id,
      status: "Job offered", //"Job Rejected" , "Job Accepted"
      last_update: new Date()
    }
    this.dataProvider.postData(data, 'addToAppointments').then(res => {
      let result
      result = res;
      if(result && result.data){
        this.dataProvider.dismissLoading();
        this.dataProvider.appointments = null;
        this.ionEvents.publish("appointments:updated", result.data);
        this.hasBeenHired();
        console.log(res);
      }else{
        this.dataProvider.dismissLoading();
        this.dataProvider.presentAlert("Job offer Failed", result.error);
      }
    }).catch(err => {
      console.log(err);
    })

  }

  removeUserEmployment(user){
    let data = { 
      employer_id_fk: this.profile.user_id, 
      user_id_fk: user.user_id,
      status: "Job offered", //"Job Rejected" , "Job Accepted"
      last_update: new Date()
    }
    this.dataProvider.postData(data, 'removeUserFromAppointments').then(res => {
      let results;
      results = res;
      if(results && results.data){
        this.dataProvider.appointments = null;
        this.ionEvents.publish("appointments:updated", results.data);
        console.log(res);
        this.applied = !this.applied;
      } 
      else{ 
          console.log(res);
      }
    }).catch(err => {
      console.log(err);
    })
  }

  hasBeenHired(){ 
    this.dataProvider.loadAppointments().then(res => {
      // this.jobsApplied = res;
      res.forEach(aUser => {
        if(aUser.employer_id_fk == this.profile.user_id && this.user.user_id == aUser.user_id_fk){
          this.applied = true;
          console.log("You have appointed this user: "+ this.user.firstame);
        }
      });
    });
  }

  

}
