import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PaketBarang } from '../../models/PaketBarang';

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
	
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaketBarangPage');
  }

}
