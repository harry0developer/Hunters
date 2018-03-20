import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, ViewController, NavParams, ActionSheetController, Events, Slides } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { TermsPage } from '../terms/terms';
import { CandidatesPage } from '../candidates/candidates';
import { JobsPage } from '../jobs/jobs';

@IonicPage()
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})
export class SetupPage {
  @ViewChild(Slides) slides: Slides;
  // data: any = {firstname:"", lastname:"", dob:"", gender:"", nationality:"", race:"", phone:"", address:"", type: ""};
  nationalities: any;
  countries: any;
  user: any;
  titles: any;
  data: any = {};
  mode:string = 'vertical';
  selectedIndex = 0;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public ionEvents: Events, public dataProvider: DataProvider, 
    public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController, public navParams: NavParams) {
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetupPage');
    // this.dataProvider.presentAlert("Welcome", "Complete your profile details and then you are set.");
    // this.data = this.navParams.get("data");
    // console.log(this.data)
    this.getCountries();
    this.getTitles()
    
  }

  selectChange(e) {
    console.log(e);
  }

  goNext() {
    this.slides.slideNext(400);
  }
  goPrev() {
    this.slides.slidePrev(400);
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
        if(res.data.type == 'Employee'){
          this.navCtrl.setRoot(CandidatesPage);
        }else{
          this.navCtrl.setRoot(JobsPage);
        }
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

  type(type){
    this.data.type = type;
    this.goNext();

  }
}
