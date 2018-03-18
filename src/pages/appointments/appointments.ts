import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { UserDetailsPage } from '../user-details/user-details';
import * as moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-appointments',
  templateUrl: 'appointments.html',
})
export class AppointmentsPage {

  appointmentSegment: string = 'offered';
 
 
  
  profile: any;
  users: any;
  appointments: any = [];
  myAppointments: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider,
    public ionEvents: Events) {  
      this.profile = JSON.parse(localStorage.getItem('user'));  
    }
    
  ionViewDidLoad() {

    this.dataProvider.loadAppointments().then(res => {
      res.map(aUser =>  {
        if(this.profile.type == 'Employer'){
          if( aUser.employer_id_fk == this.profile.user_id){
            this.myAppointments.push(aUser);
          }
        }else if(this.profile.type == 'Employee'){
          if( aUser.user_id_fk == this.profile.user_id){
            this.myAppointments.push(aUser);
          }
        }
      })
    }).then(() => {
      console.log(this.myAppointments)
      this.dataProvider.loadUsers().then(res => {
          this.mapUserWithAppointments(res, this.myAppointments);
      }).catch(err => {
        console.log(err);
      });
    })
    .catch(err => {
      console.log(err);
    });


  }

  mapUserWithAppointments(users, app){
    app.map(aUser => {
      users.map(user => {
        if(aUser.employer_id_fk == user.user_id && aUser.user_id_fk == this.profile.user_id){
          let usa = Object.assign({}, user, aUser);
          this.appointments.push(usa);
          console.log(usa);
        }
        else if(aUser.user_id_fk == user.user_id && aUser.employer_id_fk == this.profile.user_id){
          let usa = Object.assign({}, user, aUser);
          this.appointments.push(usa);
          console.log(usa)
        }
      })
    })
  }

  getDateFormat(d){
    return moment(new Date(d.split('T')[0])).fromNow();
    // let _date = new Date(d.split('T')[0]);
    // return _date.toLocaleString('en' , {day: "numeric", month: "short", year:"numeric"} );
  }

  viewUserProfile(user){
    this.navCtrl.push(UserDetailsPage, {user: user, page: 'AppointmentsPage'});
  }

}
