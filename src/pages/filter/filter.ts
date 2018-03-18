import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
 

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  type: any;
  filter: any;
  page: string;
  categories: any = ["BUILDER", "CARPENTER", "CLEANER", "DRIVER", "ELECTRICIAN", "GARDENER","MECHANIC", "NANNY", "PAINTER","PLUMBER" ,"SECURITY GUARD", "TILER" ,"WELDER"];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {

  }

  cancel(){
   this.navCtrl.pop()
  } 

  selectCategory(cat){
    this.viewCtrl.dismiss(cat);
  }

}
