import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AutocompletePage } from '../autocomplete/autocomplete';

@IonicPage()
@Component({
  selector: 'page-post-jobs',
  templateUrl: 'post-jobs.html',
})
export class PostJobsPage {
  data:any;
  categories: any;  
  skills: any;
  address;
  profile: any;
  constructor(public navCtrl: NavController,private dataProvider: DataProvider, public viewCtrl: ViewController,
    public modalCtrl: ModalController, public navParams: NavParams) {
    this.data = {};  
  }

  ionViewDidLoad() {
    this.dataProvider.getCategories().then(res => {
      this.categories = res;
    });

    this.profile = this.navParams.get('profile');
  }
 
  dismiss(){
    this.viewCtrl.dismiss();
  } 

  selectedCategory(cat){
    this.categories.forEach(cate => {
      if(cate.name == cat){
        this.skills = cate.skills;
      }
    });
  }
 
  postJob(){
    this.dataProvider.presentLoading("Please wait...");
    let res;  
 
    if(this.data && this.data.skills ){
      this.data.skills = this.data.skills.toString();
    }
    this.data.date_created = this.dataProvider.getDate();
    this.data.user_id = this.profile.user_id;

   
    this.dataProvider.postData(this.data, "addJob").then((result) => {
      res = result;
      if(res && res.error){
        this.dataProvider.dismissLoading();
        this.dataProvider.presentAlert("Posting job failed", res.error.text);
      }else{ 
        this.dataProvider.dismissLoading();
        this.viewCtrl.dismiss(res.data);
      }
    }).catch(err => {
      console.log(err);
      this.dataProvider.dismissLoading();
    })
  }


  showAddressModal () {
    let modal = this.modalCtrl.create(AutocompletePage);
    let me = this;
    modal.onDidDismiss(data => {
      this.data.address = data.address;
      this.data.lat = data.lat;
      this.data.lng = data.lng;
    });
    modal.present();
  }  

}
