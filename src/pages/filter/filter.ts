import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
 

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  type: any;
  filter: any;
  page: string;
  categories: any;
  // categories: any = ["BUILDER", "CARPENTER", "CLEANER", "DRIVER", "ELECTRICIAN", "GARDENER","MECHANIC", "NANNY", "PAINTER","PLUMBER" ,"SECURITY GUARD", "TILER" ,"WELDER"];
  constructor(public navCtrl: NavController, public dataProvider: DataProvider,public navParams: NavParams, public viewCtrl: ViewController) {
    this.dataProvider.getCategories().then(res => {
      this.categories = res;
      console.log(res);
    })
  }

  ionViewDidLoad() {}

  cancel(){
    this.navCtrl.pop()
  } 

  selectCategory(cat){
    this.viewCtrl.dismiss(cat.name);
  }

}
