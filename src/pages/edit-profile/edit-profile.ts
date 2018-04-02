import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AutocompletePage } from '../autocomplete/autocomplete';
 

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  category: any; 

  user: any; 
  data: any = {phone:"", address:""};
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, 
    public modalCtrl: ModalController, public navParams: NavParams) {
  }

  ionViewDidLoad() { 
    this.user = this.navParams.get('user');
    this.data = this.user;
    this.data.lat = this.user.lat;
    this.data.lng = this.user.lng;
    this.data.phone = this.user.phone;
  }
 
  dismiss() {
    this.viewCtrl.dismiss(null);
  }

  updateDetails() {
    this.viewCtrl.dismiss(this.data);
  }

  showAddressModal() {
    let modal = this.modalCtrl.create(AutocompletePage);
    modal.onDidDismiss(data => {
      if(data){
        console.log(data);
        this.data.address = data.address;
        this.data.lat = data.lat;
        this.data.lng = data.lng;
      }
    });
    modal.present();
  } 
  
}
