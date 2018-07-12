import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import 'rxjs/add/operator/map';
import { ListPengirimanBesar } from '../../models/ListPengirimanBesar';
import { PaketBarang } from '../../models/PaketBarang';

import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the ListPengirimanBesarProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ListPengirimanBesarProvider {
  	socketUrl:string;
  	socket:any;

  constructor() {
    console.log('Hello ListPengirimanBesarProvider Provider');
  }

    public initConnect(IP)
    {
      this.socketUrl = IP;
      this.socket = io(this.socketUrl);
      this.socket.connect();
    }

  	public initData(data):void
  	{
  		this.socket.on('connect',()=>{
			  // this.socket.emit('show_list_kurir_besar', {IDKurir:data});
  			// this.socket.emit('show_list_pengiriman_paket_barang', {IDKurir: data});
	  	});
  	}
  	public showListBesar(data)
  	{

			  this.socket.emit('show_list_kurir_besar', {IDKurir:data});
  	}
  	public showCurrentData():Observable<ListPengirimanBesar[]>
  	{
  		let observable:Observable<ListPengirimanBesar[]> = new Observable(
	    	(observer) => {
				this.socket.on('list_kurir_besar_messages', 
					(data) => {
					observer.next(data);
					});
	    	})
	    return observable;
  	}
  	public showListBesarPaket(data)
  	{

			  this.socket.emit('tarik_paket_list', data);
  	}

  	public receiveListBesarPaket():Observable<ListPengirimanBesar[]>
  	{
  		let observable:Observable<ListPengirimanBesar[]> = new Observable(
	    	(observer) => {
				this.socket.on('tarik_paket_list', 
					(data) => {
					observer.next(data);
					});
	    	})
	    return observable;
  	}
  	public callServer()
  	{
	    this.socket.emit("servers_stream");
  	}
  	public showServerData():Observable<any[]>
  	{
  		let observable:Observable<any[]> = new Observable(
	    	(observer) => {
				this.socket.on('servers_stream', 
					(data) => {
					observer.next(data);
					});
	    	})
	    return observable;
  	}
  	public sendExport(data)
  	{
  		this.socket.emit("paket_barang_import", data);

  		let observable:Observable<any> = new Observable(
	    	(observer) => {
				this.socket.on('paket_barang_import', 
					(data) => {
					observer.next(data);
					});
	    	})
	    return observable;
  	}

}
