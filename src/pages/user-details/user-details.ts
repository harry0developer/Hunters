import { Component } from '@angular/core';
import { DataProvider } from '../../providers/data/data';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {
    
  data:any = []; 
  profile: any; //me
  user: any; //current viewed profile
  page: string;
  ratings: any; 
  applied: boolean; 
  
  constructor(public navCtrl: NavController, public dataProvider: DataProvider,
    public ionEvents: Events, public navParams: NavParams) {
  }

  ionViewDidLoad() { 
    this.page = this.navParams.get('page');
    console.log(this.page);
    this.profile = JSON.parse(localStorage.getItem('user'));
    if(this.page && this.page === "Candidates"){
      this.user = this.navParams.get('user');
    }else{
      this.user = this.profile;
      this.page = "Employer";
    }
    this.hasBeenHired();
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
        this.dataProvider.presentToast("Appointment has been made successfully");
      }else{
        this.dataProvider.dismissLoading();
        this.dataProvider.presentAlert("Job offer Failed", result.error);
      }
    }).catch(err => {
      console.log(err);
    })

  }

  removeUserEmployment(user){
    this.dataProvider.presentLoading("Please wait...");
    let data = { 
      employer_id_fk: this.profile.user_id, 
      user_id_fk: user.user_id,
      status: "Job offered", 
      last_update: new Date()
    }
    this.dataProvider.postData(data, 'removeUserFromAppointments').then(res => {
      this.dataProvider.dismissLoading();
      let results;
      results = res;
      if(results && results.data){
        this.dataProvider.appointments = null;
        this.ionEvents.publish("appointments:updated", results.data);
        console.log(res);
        this.applied = !this.applied;
        this.dataProvider.presentToast("Appointment has been cancelled");
      } 
      else{ 
          console.log(res);
      }
    }).catch(err => {
      this.dataProvider.dismissLoading();
      console.log(err);
    })
  }

  hasBeenHired(){ 
    this.dataProvider.loadAppointments().then(appointments => {
      appointments.forEach(aUser => {
        if(aUser.employer_id_fk == this.profile.user_id && this.user.user_id == aUser.user_id_fk){
          this.applied = true;
          console.log("You have appointed this user: "+ this.user.firstame);
        }
      });
    }).catch(err => {
      console.log(err);
    });
  }

  editProfile(){
    console.log("Edit profile");
  }

}
