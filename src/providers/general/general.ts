import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
/*
  Generated class for the GeneralProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeneralProvider {
  	socketUrl:string;
  	socket:any;
  constructor(private storage:Storage) {
    console.log('Hello GeneralProvider Provider');
  		this.socketUrl = "http://localhost:3000";
  		this.socket = io(this.socketUrl);
  		this.socket.connect();
  }

}
