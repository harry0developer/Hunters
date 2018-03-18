import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, ModalController } from 'ionic-angular';
import { OtpPage} from '../otp/otp';
import { DataProvider } from '../../providers/data/data';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  data: any = {};
  constructor(public navCtrl: NavController, public dataProvider:DataProvider, public viewCtrl: ViewController, public modalCtrl: ModalController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  dismiss() {
    this.navCtrl.setRoot(LoginPage)
  }

  openOTPPage(){ 

    this.navCtrl.setRoot(OtpPage, {data: this.data});
 
  }

  sendOTP(){
    this.dataProvider.presentLoading("Please wait...");
    let res; 
    // this.data = {email:"harry@test.com", password: "123456"};
    this.dataProvider.postData(this.data,'sendOTP').then((result) => {
      res = result;
      if(res && res.error){
        console.log(res.error);
        this.dataProvider.dismissLoading();
        this.dataProvider.presentAlert("Signup Failed", res.error);
      }else{ 
        this.data.otp = res.data;
        this.openOTPPage();
        console.log(res);
        this.dataProvider.dismissLoading();
      }
    }).catch(err => {
      console.log(err);
      this.dataProvider.dismissLoading();
    })
  }
  
}
