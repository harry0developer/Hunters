import { Component } from '@angular/core';
import { DataProvider } from '../../providers/data/data';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
    
  data:any = []; 
  profile: any; //me
  user: any; //current viewed profile
  page: string;
  ratings: any; 
  applied: boolean; 
  
  constructor(public navCtrl: NavController, public dataProvider: DataProvider,
    public ionEvents: Events, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() { 
    this.profile = JSON.parse(localStorage.getItem('user'));
  }
 

  editProfile(){
    let editProfile = this.modalCtrl.create(EditProfilePage, {user:this.profile});
    editProfile.onDidDismiss(data => {
      if(data){
        let res;
        let updatedData = {address: data.address, lat:data.lat, lng: data.lng, phone: data.phone, user_id: data.user_id};
        this.dataProvider.postData(updatedData, 'updateProfile').then(results => {
          res = results;
          console.log(res.data);
          if(res && res.data && res.data.length > 0){
            localStorage.setItem('user', JSON.stringify(res.data[0]));
            console.log(localStorage);
          }
          else{
            console.log(res.error);
          }
        }).catch(err => {
          console.log(err);
        })
      }
    });
    editProfile.present();
  } 
 
}
