import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { SetupPage} from '../setup/setup';
import { DataProvider } from '../../providers/data/data';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
  data: any = {};
  otp: any;
  constructor(public navCtrl: NavController,public alertCtrl: AlertController, public dataProvider: DataProvider, public modalCtrl: ModalController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage');
    this.data = this.navParams.get("data");
    console.log(this.data);
  }

 
  confirmOTP(){    
    if(this.data.otp == this.otp){
      // this.navCtrl.setRoot(UserTypePage , {data: this.data});
      this.navCtrl.setRoot(SetupPage , {data: this.data});
    }else{
      console.log(this.otp + " " + this.data.otp);
      this.dataProvider.presentAlert("Otp code incorrect", "The code you have entered does not match the one sent to your email address");
    }
  }
  

  resendOTP() {
    let alert = this.alertCtrl.create({
      title: "Request new code",
      message: 'Enter email address you would like the code to be send to',
      
      inputs: [
        {
          name: 'email',
          placeholder: 'myemail@mail.com',
          type: 'email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Resend Code',
          handler: data => {
            console.log(data);
           this.data.email = data.email;
           this.sendOTP();
          }
        }
      ]
    });
    alert.present();
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
        console.log(this.data);
        this.dataProvider.dismissLoading();
        this.dataProvider.presentToast("OTP Code sent successfully");
      }
    }).catch(err => {
      console.log(err);
      this.dataProvider.dismissLoading();
    })
  }

  dismiss(){
    this.navCtrl.setRoot(LoginPage)
  }

}
