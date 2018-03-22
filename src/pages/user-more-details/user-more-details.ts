import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
 

@IonicPage()
@Component({
  selector: 'page-user-more-details',
  templateUrl: 'user-more-details.html',
})
export class UserMoreDetailsPage {
  category: any; 

  user: any;
  data:any = [];
  personal: any;
  education: any;
  experience: any;
  skills: any;

  constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams) {
    this.init();
  }

  ionViewDidLoad() { }

  init(){
    this.category = this.navParams.get('category');
    this.user = this.navParams.get('user');
    this.skills = this.navParams.get('skills');
    this.experience = this.navParams.get('experience');
    this.education = this.navParams.get('education'); 
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  getRoles(roles){
    if(roles){
      return roles.split(',');
    }
    return [];
  }

  getShortDate(d){
    let _date = new Date(d);
    let ddd = _date.toLocaleString("en", { month: "short", year: "numeric" });
    if(ddd == "Invalid Date"){
      return "To date";
    }
    return ddd;
  }

  getEduShortDate(d){
    let _date = new Date(d);
    let ddd = _date.toLocaleString("en", { month: "short", year: "numeric" });
    if(ddd == "Invalid Date"){
      return "In progress";
    }
    return ddd;
  }

  
 
}
