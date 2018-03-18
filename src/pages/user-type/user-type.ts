import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PersonalDetailsPage } from '../personal-details/personal-details';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-user-type',
  templateUrl: 'user-type.html',
})
export class UserTypePage {
  data: any;
  employer: boolean = false;;
  employee: boolean = false;;
  constructor(public navCtrl: NavController,public modalCtrl: ModalController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserTypePage');
    this.data = this.navParams.get('data');
  }

  pick(type){
    if(type == 'employer'){
      this.employee = false;
      this.employer = true;
    }
    else{
      this.employee = true;
      this.employer = false;
    }
  }

  typeModal(type){
    this.data.type = type;
    // this.navCtrl.push(PersonalDetailsPage, {data: this.data});

    let setupModal = this.modalCtrl.create(PersonalDetailsPage, {data: this.data});
    setupModal.onDidDismiss(data => {
      this.navCtrl.setRoot(HomePage);
    });
    setupModal.present();
  }

  continue(){
    if(this.employer){
      this.typeModal('Employer');
    }else{
      this.typeModal('Employee');
    }
  }



}
