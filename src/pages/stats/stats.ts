import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';


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
    console.log(this.job);
  }
 
 

}
