import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UserMoreDetailsPage } from '../user-more-details/user-more-details';
import { DataProvider } from '../../providers/data/data';

import * as moment from 'moment';

 

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  
  profile: any;
  personal: any;
  education: any;
  experience: any;
  skills: any;
  hobbies: any;
 
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    this.profile = JSON.parse(localStorage.getItem('user'));
    if(this.profile){
      this.skills = this.dataProvider.getUserSkills(this.profile);
      this.experience = this.dataProvider.getUserExperience(this.profile);
      this.education = this.dataProvider.getUserEducation(this.profile);
    }
  }
 
  loadUserMoreDetails(cat){
    let userDetails = this.modalCtrl.create(UserMoreDetailsPage, {user: this.profile, experience: this.experience, education: this.education, skills: this.skills, category: cat});
    userDetails.present();
  }
 
}
