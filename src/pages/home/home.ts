import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PaketBarang } from '../../models/PaketBarang';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	list_pengiriman:Array<any>;

  constructor(public navCtrl: NavController, private socket:Socket) {
  	this.list_pengiriman = [];
  	this.socket.on("connect",(data)=>{
  		this.socket.emit("show_list_pengiriman");
  	});
	  	this.getListPengiriman().subscribe(data=>{
				this.list_pengiriman.push(data);
	  	});
	  	// console.log(this.list_pengiriman)
  }

    getListPengiriman() {
	    let observable = new Observable(observer => {
	      this.socket.on('show_list_pengiriman', (data) => {
	        observer.next(data);
	      });
	    })
	    return observable;
	  }
}
