import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the PaketBarangProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PaketBarangProvider {

  constructor(public http: HttpClient) {
    console.log('Hello PaketBarangProvider Provider');
  }

}
