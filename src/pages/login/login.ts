import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { BesarPage } from '../../pages/besar/besar';
// import { TabsPage } from '../../pages/tabs/tabs';
import { GeneralProvider } from '../../providers/general/general';
import { Storage } from '@ionic/storage';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Rx';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  ip_forward:string;
  cabangs:any[];
  username:string;
  password:string;
  isValid:boolean;
  server:any;
  private socketUrl:string;
  private socket:any;

  constructor(public storage:Storage, public navCtrl: NavController, public navParams: NavParams, public generalProvider:GeneralProvider) {
    this.ip_forward = "http://localhost:3000";
    this.username="";
    this.password="";
    this.password="";
    this.isValid = true;
    this.cabangs = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  connect()
  {
    this.socket = io(this.ip_forward);
    this.socket.connect();

    this.socket.emit("servers_stream");

    let observable:Observable<any> = new Observable(
      (observer) => {
      this.socket.on('servers_stream', 
        (data) => {
        observer.next(data);
        });
      });
    observable.subscribe((data)=>{
      this.cabangs = data;
      console.log(data);
    });
  }
  getServer()
  {
    this.storage.set("socketUrl", this.server.IP);
    this.storage.set("IDCabang", this.server.IDCabang);
    this.storage.set("nama_cabang", this.server.nama_cabang);
    this.storage.set("IP", this.server.IP);
    console.log(this.server);
    this.generalProvider.initConnect(this.server.IP);
  }
  submit()
  {


    let data = {
      IDKurir : this.username,
      password :this.password
    }
    let total = 0;
    this.generalProvider.callLogin(data);
    this.generalProvider.receiveLogin().subscribe(
      data=>{
        console.log(data);
        total = data.total;
        this.gotoHome(total, data.jenis);
      });
  }

  gotoHome(total, jenis)
  {
    if(total > 0){
      console.log("success login");
      this.storage.set("username",this.username);
      this.storage.set("password",this.password);
      this.storage.set("IDKurir", this.username);
      if(jenis == "MTR"){
        this.navCtrl.setRoot(HomePage);
      }
      else{
        this.navCtrl.setRoot(BesarPage);
      }
      // this.navCtrl.setRoot(TabsPage);
      this.username = "success";
      this.password = "success";
    }
    else
    {
      this.isValid = false;

      setTimeout(()=>{
        this.isValid = true;
      }, 5000);
    }
  }

  enter():void
  {
    this.navCtrl.setRoot(HomePage);
  	// this.navCtrl.setRoot(TabsPage);
  }

}
