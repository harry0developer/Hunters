import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { UserDetailsPage } from '../user-details/user-details';


@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {
  job: any;
  users: any;
  stats: string = "views";
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider) {
    
  }
  
  ionViewDidLoad() {
    this.job = this.navParams.get('job'); 
  }

  viewAppliedUserDetails(aUser){ 
    this.navCtrl.push(UserDetailsPage, {user: aUser});
  }
 
 

}
