import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController,ViewController } from 'ionic-angular';
import { PaketBarang } from '../../models/PaketBarang';
import { ListPengirimanBesar } from '../../models/ListPengirimanBesar';
import { ListPengirimanBesarProvider } from '../../providers/list-pengiriman-besar/list-pengiriman-besar';
import { LokasiProvider } from '../../providers/lokasi/lokasi';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

declare var google: any;

@Component({
	selector: 'page-besar',
	templateUrl: 'besar.html'
})
export class BesarPage {
	list_pengiriman_besar:Array<ListPengirimanBesar>;
	cabangs:any[];
	IDKurir:number;
	IP:number;
	constructor(public navCtrl: NavController, 
		private listPengirimanBesarProvider:ListPengirimanBesarProvider,
		private storage:Storage) {
		this.initData();
	}

	initData(){
		this.cabangs=[];
		this.list_pengiriman_besar = [];
		this.IDKurir = 0;
		this.storage.get("IDKurir").then(
			data=>{
				this.IDKurir = parseInt(data);
			});
		setTimeout(()=>{
		this.storage.get('IP').then(
			data=>{
				this.listPengirimanBesarProvider.initConnect(data);
				this.listPengirimanBesarProvider.showListBesar(this.IDKurir);
				this.listPengirimanBesarProvider.callServer();
				this.listPengirimanBesarProvider.showServerData().subscribe(data=>{
					this.cabangs = data;
					console.log(data);
				});

				this.listPengirimanBesarProvider.showCurrentData().subscribe(
					(current:ListPengirimanBesar[])=>{
						console.log(current);
						this.list_pengiriman_besar = current;
						this.storage.set('list_pengiriman_besar', data);
					});
			});
		},3000);
	}

	getNamaServer(id)
	{
		let data = this.cabangs.filter(data=>data.IDCabang==id);
		if(data == undefined)
			return "";
		else
			return data[0].nama_cabang;
	}

	loadData(id)
	{
		console.log(id);
		let dataSimpan;
		this.listPengirimanBesarProvider.showListBesarPaket(id);
		this.listPengirimanBesarProvider.receiveListBesarPaket().subscribe(
			data=>{
				console.log(data);
				dataSimpan = data;
				this.storage.set(id.toString(), data);

			});
	}
	change()
	{
		console.log(this.IP);
	    this.storage.set("socketUrl", this.IP);
	    this.storage.set("IP", this.IP);
	    this.listPengirimanBesarProvider.initConnect(this.IP);
	}

	sendData(id)
	{
		this.storage.get(id.toString()).then(
			data=>{
				this.listPengirimanBesarProvider.sendExport(data).subscribe(
					resp=>{
						if(resp.status=="OK")
						{
							console.log("ok");
							this.storage.set(id.toString(),null);
						}
						else
							console.log("no oke");
					});
			});
	}

}
