import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';

/*
  Generated class for the LokasiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var google: any;

@Injectable()
export class LokasiProvider {

  	socketUrl:string;
  	socket:any;

	private lokasi:any;
	private namaKota:any;
	private direction:number;
	private directionRender:any;

	constructor(private http: Http, private geolocation:Geolocation, private storage: Storage) {
  		this.socketUrl = "http://localhost:3000";
  		this.socket = io(this.socketUrl);
  		this.socket.connect();

		console.log('Hello LokasiProvider Provider');
		this.namaKota='Mencari GPS...';
		this.direction = 0;
		this.lokasi = {
			found : false
		};
	}

	public liveLocation(data)
	{
		this.socket.emit('kurir_location',data);
	}

	// watch lokasi saat ini
	public watchLocation(timeout = 5000)
	{
		var option = {
			timeout : timeout,
			enableHighAccuracy:true
		};
		this.geolocation.watchPosition(option).filter((p)=> p.coords !== undefined).subscribe(
			data =>{
				console.log('load location from geolocation '+data);
				let newLocation = {
					lat : data.coords.latitude,
					long: data.coords.longitude,
					timestamp:data.timestamp,
					found : true
				};
				this.storage.set('lokasi', newLocation);
				this.setLocation(newLocation);
				console.log(newLocation);
			},
			error =>{
				console.log('error pada :'+error);

				this.loadLocationFromStorage().then(
					data =>{
						if(data == null)
							throw console.log('data null');
							
						console.log('load location from storage '+data);
						this.setLocation(data);
					}
				).catch(
					(err) =>{
						console.log('gagal ' + err);
					}
				);
				
			}
		);	
	}
	// set location
	public setLocation(newLocation)
	{
		this.lokasi = newLocation;
	}

	// load jadwalSholat from storage
	public loadLocationFromStorage()
	{
		return this.storage.ready().then(()=>{
			return this.storage.get('lokasi');
		});
	}

	// get location now
	public getLocation()
	{
		return this.lokasi;
	}
	// untuk setnama kota awal
	public setNamaKota(newNama)
	{
		this.namaKota = newNama;
	}
	// untuk mengembalikan nilai namakota
	public getNamaKota()
	{
		return this.namaKota;
	}
	// inisialisasi pencarian kota saat ini
	public findKota()
	{
		if(this.lokasi.found == false)
		{
			this.watchLocation(500);
			console.log("location null");
		}
		let geocoder = new google.maps.Geocoder();
		let latlng = new google.maps.LatLng(this.lokasi.lat,this.lokasi.long);
		let locationGeocoder =  geocoder.geocode({'latLng' : latlng},(results,status) =>{
		      if (status == google.maps.GeocoderStatus.OK) {
		      console.log(results)
		        if (results[1]) {
		         //formatted address
		         console.log(results[0].formatted_address)
		        //find country name
		        let city;
	             for (var i=0; i<results[0].address_components.length; i++) {
		            for (var b=0;b<results[0].address_components[i].types.length;b++) {

		            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
		                if (results[0].address_components[i].types[b] == "administrative_area_level_2") {
		                    //this is the object you are looking for
		                    city= results[0].address_components[i];
		                    break;
		                }
		            }
		        }
		        //city data
		        this.setNamaKota(results[0].formatted_address);
		        // save it to local
		        this.storage.set('namaKota', city.short_name);
		        this.storage.set('alamat', results[0].formatted_address);
		        } else {
		          console.log("No results found");
		        }
		      } else {
		        console.log("Geocoder failed due to: " + status);
		      }
		});
	}
	// untuk autocomplete
	autoComplete(input)
	{
		var options = {componentRestrictions: {country: 'id'}};
		var autocomplete = new google.maps.places.Autocomplete(input, options);
		return autocomplete;
	}
	// untuk generate jarak dari tempat awal
	generateDirection(start, end)
	{
		this.directionRender =  new google.maps.DirectionsRenderer({suppressMarkers : true});

		let directionsService =  new google.maps.DirectionsService;
		directionsService.route({
			origin: start,
			destination: end,
			travelMode: 'DRIVING'
		}, (response, status) => {
			if (status === 'OK') {
				// console.log(response);
				// this.testSendToServer(response.routes[0].legs[0]);
				let leg = response.routes[0].legs[0];

				let total = 0;
				let myroute = response.routes[0];
				for (var i = 0; i < myroute.legs.length; i++) {
				total += myroute.legs[i].distance.value;
				}
				total = total / 1000;
				this.setDirection(total);
				console.log(total+'Km jarak dari :'+start+' menuju :'+end);
			} else {
		  		console.log('Directions request failed due to ' + status);
		  		this.setDirection(-1);
			}
		});
	}


	// set nilai direksi seblum diambil
	setDirection(total)
	{
		this.direction = total;
	}

	getDirection()
	{
		return this.direction;
	}

	getInitMap(mapElement) {
	    return new google.maps.Map(mapElement, {
	      zoom: 9,
	      center: {lat: this.lokasi.lat, lng: this.lokasi.long},
	      mapTypeControl: false,
	      scaleControl: false,
	      scrollwheel: false,
	      navigationControl: false,
	      streetViewControl: false,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    });
	}

    public distance(lat1, lon1, lat2, lon2, unit) {
      var radlat1 = Math.PI * lat1/180
      var radlat2 = Math.PI * lat2/180
      var theta = lon1-lon2
      var radtheta = Math.PI * theta/180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist)
      dist = dist * 180/Math.PI
      dist = dist * 60 * 1.1515
      if (unit=="K") { 
        dist = dist * 1.609344 
      }
      if (unit=="N") {
        dist = dist * 0.8684 
      }
      return dist
    }

}
