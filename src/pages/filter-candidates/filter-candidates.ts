import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

@IonicPage()
@Component({
  selector: 'page-filter-candidates',
  templateUrl: 'filter-candidates.html',
})
export class FilterCandidatesPage {
  filter: any;
  categories: any;
  settings: any = {distance: 0, title: '' };
  constructor(public navCtrl: NavController, public dataProvider: DataProvider, public viewCtrl: ViewController, public navParams: NavParams) {
  }


  ionViewDidLoad(){
    this.dataProvider.getCategories().then(res => {
      this.categories = res;
    });
    
    this.filter = this.navParams.get('filter');
    if(!this.filter){
      this.filter = JSON.parse(localStorage.getItem('filter'));
    }
    if(this.filter){
      this.settings.distance = this.filter.distance;
      this.settings.title = this.filter.title;
    }else{
      this.settings.distance = 0;
    }
  }

  cancel(){
    this.viewCtrl.dismiss(this.filter);
  } 

  applyFilter(){
    const data = {
      distance: this.settings.distance,
      title: this.settings.title,
    }
    this.viewCtrl.dismiss(data);
  }

  clearFilter(){
    this.viewCtrl.dismiss(null);
  }
}
