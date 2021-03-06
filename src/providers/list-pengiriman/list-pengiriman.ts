import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import 'rxjs/add/operator/map';
import { ListPengiriman } from '../../models/ListPengiriman';
import { PaketBarang } from '../../models/PaketBarang';

import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the ListPengirimanProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class ListPengirimanProvider {
  	socketUrl:string;
  	socket:any;

  constructor(private storage:Storage) {
  		console.log('Hello ListPengirimanProvider Provider');
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
			  this.socket.emit('show_list_pengiriman', {IDKurir:data});
  			this.socket.emit('show_list_pengiriman_paket_barang', {IDKurir: data});
	  	});
  	}

    public getStatusDisconect():Observable<any>
    {
      let observable:Observable<any> = new Observable(
        (observer) => {
        this.socket.on('disconnect', 
          () => {
            observer.next({connectWs : false});
          });
        })
      return observable;
    }
    public getStatusConnect():Observable<any>
    {
      let observable:Observable<any> = new Observable(
        (observer) => {
        this.socket.on('connect', 
          () => {
            observer.next({connectWs : true});
          });
        })
      return observable;
    }

  	public showCurrentData():Observable<ListPengiriman[]>
  	{
  		let observable:Observable<ListPengiriman[]> = new Observable(
	    	(observer) => {
				this.socket.on('init_list_pengiriman', 
					(data) => {
					observer.next(data);
					});
	    	})
	    return observable;
  	}

  	public getDetailPaketBarang():Observable<PaketBarang[]>
  	{
  		let observable:Observable<PaketBarang[]> = new Observable(
	    	(observer) => {
				this.socket.on('init_list_pengiriman_paket_barang', 
					(data) => {
					observer.next(data);
					});
	    	})
	    return observable;
  	}

    public getListPengiriman():Observable<ListPengiriman>
    {
        let observable:Observable<ListPengiriman> = new Observable(
          (observer) => {
          this.socket.on('list_pengiriman_stream', 
            (data) => {
                observer.next(data);
              console.log(data);
            });
          })
        return observable;
    }
  	public getListPengirimanPaketBarang():Observable<PaketBarang>
  	{
  	    let observable:Observable<PaketBarang> = new Observable(
  	    	(observer) => {
  				this.socket.on('list_pengiriman_paket_barang_stream', 
  					(data) => {
  					  observer.next(data);
  					});
  	    	})
  	    return observable;
  	}

    updateStatus(IDPengiriman, IDPaket, no_resi, IDKurir, status, keterangan):Observable<any>
    {
      let send = {
        type : 'ubah_status',
        IDPengiriman : IDPengiriman,
        status_pengiriman:status,
        keterangan : keterangan,
        IDKurir:IDKurir,
        IDPaket:IDPaket,
        no_resi:no_resi,
      };
      this.socket.emit('list_pengiriman_stream', send);

      let observable:Observable<any> = new Observable(
        (observer) => {
        this.socket.on('list_pengiriman_stream', 
          (data) => {
            observer.next(data);
          });
        })
      return observable;
    }

    sendStatusOnline(status)
    {

      this.socket.emit("kurir_status", status);
    }
}
