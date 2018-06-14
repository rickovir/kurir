import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ViewController } from 'ionic-angular';
import { PaketBarang } from '../../models/PaketBarang';
import { ListPengirimanProvider } from '../../providers/list-pengiriman/list-pengiriman';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the PaketBarangPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paket-barang',
  templateUrl: 'paket-barang.html',
})
export class PaketBarangPage {
	paket:PaketBarang;
  keterangan:string;
  IDPengiriman:number;
  loader:boolean;
	
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private listPengirimanProvider:ListPengirimanProvider,
    public viewCtrl:ViewController,
    public loadingCtrl: LoadingController) {
  	this.paket = JSON.parse(this.navParams.get('paket_barang'));
    this.IDPengiriman = this.navParams.get('IDPengiriman');
    console.log(this.paket);
    console.log('IDPengiriman :'+this.IDPengiriman);
    this.loader = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaketBarangPage');
  }

  ubahStatus(status)
  {
  	this.paket.status_pengiriman = status;
  }

  tampil()
  {
    console.log(this.keterangan);
  }

  save()
  {
    this.loader = true;
    let save = this.listPengirimanProvider.updateStatus(this.IDPengiriman,this.paket.status_pengiriman, this.keterangan);
      save.subscribe(
        data=>{
          if(data.status == "OK")
           {
             this.loader = false;
             this.dismissMe();
             console.log("OK");
           }
           else
           {
             this.loader = false;
             this.dismissMe();
             console.log("gagal");
           }
        });
  }

  dismissMe()
  {
    let data = {
      IDPengiriman:this.IDPengiriman,
      status_pengiriman:this.paket.status_pengiriman,
      keterangan:this.keterangan
    };   
    this.viewCtrl.dismiss(data).catch(data=>{console.log("gagalnya gak jelas")
    });
  }

}
