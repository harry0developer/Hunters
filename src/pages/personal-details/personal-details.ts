import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, ViewController, NavParams, ActionSheetController, Events } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { TermsPage } from '../terms/terms';
// import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-personal-details',
  templateUrl: 'personal-details.html',
})
export class PersonalDetailsPage {
  r = Math.floor((Math.random() * 5) + 1);
  data: any = {firstname:"", lastname:"", dob:"", gender:"", nationality:"", race:"", phone:"", address:"", type: ""};
  nationalities: any;
  countries: any;
  user: any;
  titles: any;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public ionEvents: Events, public dataProvider: DataProvider, 
    public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, public navParams: NavParams) {
    }

  ionViewDidLoad() {
    this.dataProvider.presentAlert("Welcome", "Complete your profile details and then you are set.");
    this.data = this.navParams.get("data");
    console.log(this.data)
    this.getCountries();
    this.getTitles()
  }

  getCountries(){
    this.dataProvider.getCountries().then(res => {
      console.log(res);
      this.countries = res;
    }).catch(err => {
      console.log(err);
    })
  }

  getTitles(){
    this.dataProvider.getTitles().then(res => {
      console.log(res);
      this.titles = res;
    }).catch(err => {
      console.log(err);
    })
  }


  signup(){
    this.dataProvider.presentLoading("Please wait...");
    let res;  
    console.log(this.data);
    this.dataProvider.postData(this.data, "signup").then((result) => {
      res = result;
      this.dataProvider.dismissLoading();
      if(res && res.error){
        console.log(res.error);
        this.dataProvider.presentAlert("Signup Failed", res.error.text);
      }else{ 
        console.log(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        this.ionEvents.publish("user:loggedIn", res.data);
        this.navCtrl.setRoot(HomePage);
      }
    }).catch(err => {
      console.log(err);
      this.dataProvider.dismissLoading();
    })
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }

  terms(){
      let tc = this.modalCtrl.create(TermsPage);
      tc.present();
  }

  // presentActionSheetType() {
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: 'Register as',
  //     buttons: [
  //       {
  //         text: 'Employer - to create jobs', 
  //         icon: "filing",
  //         handler: () => {
  //           console.log('employer clicked');
  //           this.createProfile('Employer');
  //         }
  //       },{
  //         text: 'Employee - looking for a job',
  //         icon: "hammer",
  //         handler: () => {
  //           console.log('employee clicked');
  //           this.createProfile('Employee');
  //         }
  //       },{
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       }
  //     ]
  //   });
  //   actionSheet.present();
  // }
}
