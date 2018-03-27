import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController, ModalController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { DataProvider } from '../../providers/data/data';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  lastImage: string = null;
  loading: Loading;

  base64: any;
  url: string;
  myProfile: any;
  uploads: string = '';
  
  constructor(public navCtrl: NavController, public dataProvider: DataProvider,
    public ionEvents: Events, private camera: Camera, private transfer: FileTransfer, 
    private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, 
    public toastCtrl: ToastController,
    public platform: Platform, public loadingCtrl: LoadingController,
    public modalCtrl: ModalController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.myProfile = JSON.parse(localStorage.getItem('user'));
    this.uploads = this.dataProvider.getMediaLink();
  }



  //================================

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      allowEdit: true,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetHeight: 300,
      targetWidth: 300
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      this.base64 = imagePath;
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }  
  // Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}
 
// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
    this.uploadImage();
  }, error => {
    this.presentToast('Error while storing file.');
  });
}
 
private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
 
// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    console.log("Path to image is null");
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}

public uploadImage() {
  let obj = {"email":"harry@test.com", "url": ""};
  var url = this.url+'uploadProfilePicture';
  var targetPath = this.pathForImage(this.lastImage);
  var filename = this.lastImage;
  var options = {
    fileKey: "file",
    fileName: filename,
    chunkedMode: false,
    mimeType: "multipart/form-data",
    params : {'fileName': filename}
  };
 
  const fileTransfer: FileTransferObject = this.transfer.create();
 
  this.loading = this.loadingCtrl.create({
    content: 'Uploading...',
  });
  this.loading.present();

  fileTransfer.upload(targetPath, url, options).then(data => {
    this.loading.dismissAll();
    obj.url = data.response;
    console.log(obj);
    this.updatePictureUrl(obj);
    // this.presentToast('Profile changed succesful.');
  }, err => {
    
    this.loading.dismissAll()
    this.presentToast('Error while uploading file.');
  });
}


updatePictureUrl(obj){
  this.dataProvider.presentLoading("Please wait...");
  let res;
  console.log(obj); 

  this.dataProvider.postData(obj,'updatePictureUrl').then((result) => {
    res = result;
    console.log(res);
    if(res && res.error){
      this.dataProvider.dismissLoading();
      this.dataProvider.presentToast("Error occured, profile not changed, try again later");
    }else{
      this.dataProvider.dismissLoading();
      this.myProfile.picture = obj.url;
      
      localStorage.setItem('loginData', JSON.stringify(this.myProfile));
      // this.dataProvider.setMyProfile(this.myProfile);

      this.ionEvents.publish("user:profileChanged", this.myProfile);
      console.log(this.myProfile);

      this.lastImage = null;
      this.dataProvider.presentToast("Profile changed succefully");
    }
  }, (err) => { 
    console.log(err);
    this.dataProvider.dismissLoading();
  });
}
 

sendURL(obj){
  this.dataProvider.presentLoading("Please wait..");
  let res; 
  console.log(obj);
  this.dataProvider.postData(obj,'updatePictureUrl').then((result) => {
    res = result;
    console.log(res);
    if(res && res.error){
      this.dataProvider.dismissLoading();
      this.dataProvider.presentToast(res.error);
    }
    else{
      this.dataProvider.dismissLoading();
      this.presentToast('DB picture url updated successfully.');
    }
  }, (err) => { 
    this.dataProvider.presentToast(res.error);
    this.dataProvider.dismissLoading();
  });
}


}
