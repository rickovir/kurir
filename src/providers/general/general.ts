import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
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
  }
  public initConnect(IP)
  {
    this.socketUrl = IP;
    this.socket = io(this.socketUrl);
    this.socket.connect();
  }
  public callServer()
  {
    this.socket.emit("servers_stream");
  }
  public receiveServer():Observable<any>
  {
    let observable:Observable<any> = new Observable(
      (observer) => {
      this.socket.on('servers_stream', 
        (data) => {
        observer.next(data);
        });
      });
    return observable;
  }
  public callLogin(data)
  {
    this.socket.emit("login_kurir", data);
  }
  public receiveLogin():Observable<any>
  {
    let observable:Observable<any> = new Observable(
      (observer) => {
      this.socket.on('login_kurir_feedback', 
        (data) => {
        observer.next(data);
        });
      });
    return observable;
  }

}
