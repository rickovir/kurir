import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController,ViewController } from 'ionic-angular';
import { PaketBarang } from '../../models/PaketBarang';
import { ListPengiriman } from '../../models/ListPengiriman';
import { ListPengirimanProvider } from '../../providers/list-pengiriman/list-pengiriman';
import { LokasiProvider } from '../../providers/lokasi/lokasi';
import { PaketBarangPage } from '../../pages/paket-barang/paket-barang';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

declare var google: any;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
  	directionsService = new google.maps.DirectionsService;
	list_pengiriman:Array<ListPengiriman>;
	paket_barang:Array<PaketBarang>;
	IDKurir:number;

	lat:number;
	lng:number;

	isOnline:boolean;

	constructor(public navCtrl: NavController, 
		private listPengirimanProvider:ListPengirimanProvider, 
		private lokasiProvider:LokasiProvider,
	    public viewCtrl:ViewController,
		private storage:Storage, 
		public modalCtrl:ModalController) {
		this.IDKurir = 0;
		this.storage.get("IDKurir").then(
			data=>{
				this.IDKurir = parseInt(data);
			});
		this.storage.get('IP').then(
			data=>{
				this.listPengirimanProvider.initConnect(data);
				this.isOnline = false;
				this.paket_barang = [];
				this.list_pengiriman = [];

				setTimeout(()=>{
					this.lokasiProvider.findKota();
				},3000);

				this.init();

				this.synData();

				this.cekKota();

				setTimeout(()=>{
					if(this.list_pengiriman.length == 0)
					{
						this.storage.get('list_pengiriman_data').then(data=>{
							this.list_pengiriman = data;
						});
						this.storage.get('paket_barang_data').then(data=>{
							this.paket_barang = data;
						});
					}
				}, 3000);

				this.listPengirimanProvider.getStatusConnect().subscribe(
					data=>{
						this.isOnline = data.connectWs;
						var status = {
							IDKurir:this.IDKurir,
							isActive:'Y'
						}
						this.listPengirimanProvider.sendStatusOnline(status);
					});

				this.listPengirimanProvider.getStatusDisconect().subscribe(
					data=>{
						this.isOnline = data.connectWs;
						var status = {
							IDKurir:this.IDKurir,
							isActive:'N'
						}
						this.listPengirimanProvider.sendStatusOnline(status);
					});
			});
	}

	init()
	{
		this.storage.get("IDKurir").then(data=>{
			this.listPengirimanProvider.initData(data);	
		})
		this.listPengirimanProvider.showCurrentData().subscribe(
			(data:ListPengiriman[])=>{
				this.list_pengiriman = data;
				console.log(data);
				this.storage.set('list_pengiriman_data', data);
			});
		this.listPengirimanProvider.getDetailPaketBarang().subscribe(
			(data:PaketBarang[]) => {
				this.paket_barang = data;
				console.log(data);
				this.storage.set('paket_barang_data', data);
			});
		console.log("data null");
		this.storage.set('lastCheck', new Date().getTime());
	
	}

	synData()
	{
		this.listPengirimanProvider.getListPengiriman().subscribe(
			(data:any)=>{
				if(data.type == "add")
				{
					console.log(data);
					var newData = data.data;
					for(var i = 0; i<newData.length; i++)
					{
						this.list_pengiriman.push(newData[i]);
					}
					this.storage.set('list_pengiriman_data', this.list_pengiriman);
				}
				else if(data.type == "ubah_status")
				{
					this.list_pengiriman = this.list_pengiriman.map(
	    			list=>{
	    				if(list.IDPengiriman == data.data.IDPengiriman)
	    				{
	    					list.status_pengiriman = data.data.status_pengiriman;
	    					list.keterangan = data.data.keterangan;
	    				}
						return list;
	    			})
	    			console.log(data.data);
				}
				else if(data.type == "delete")
				{
					this.list_pengiriman = this.list_pengiriman.filter(list=>list.IDPengiriman!==data.IDPengiriman);
				}
			});
		this.listPengirimanProvider.getListPengirimanPaketBarang().subscribe(
			(data : PaketBarang)=>{
				this.paket_barang.push(data);
				this.storage.set('paket_barang_data', this.paket_barang);
			});
	}


	getPaket(ID):PaketBarang
	{
		let paket_barang:PaketBarang[] = this.paket_barang.filter((paket:PaketBarang)=>{
			return paket.IDPaket == ID;
		});
		if(paket_barang.length > 0)
			return paket_barang[0];
		else
			return null;
	}


	cekKota()
	{
	    let n:number = 0;
	    Observable.interval(5000).subscribe(() =>{
	      if(n>60)
	      {
	        this.lokasiProvider.findKota();
	        n = 0;
	      }

	      if(this.lokasiProvider.getLocation().found == true){
	        this.lat = this.lokasiProvider.getLocation().lat;
	        this.lng = this.lokasiProvider.getLocation().long;
	        let liveData = {
	        	lat:this.lat,
	        	lng:this.lng,
	        	jln:this.lokasiProvider.getNamaKota()
	        }
	        this.lokasiProvider.liveLocation(liveData);
	      }
	      n++;
	    });
	}


	getJarak(lat2,lng2)
	{
		if(this.lat == undefined && this.lng == undefined )
			return 0;
		else
			return this.roundUp(this.lokasiProvider.distance(this.lat, this.lng, lat2,lng2, "K"),1);
	}
	private roundUp(num, precision):number {
	  precision = Math.pow(10, precision)
	  return Math.ceil(num * precision) / precision
	}

	sortByJarak()
	{
		let n = this.list_pengiriman.length;
		for(let j=0; j< n-1; j++)
		{
			let iMin = j;
			for (let i = j+1; i < n; i++)
			{
				let jarak1 = this.getJarak(this.list_pengiriman[i].lat,this.list_pengiriman[i].lng);
				let jarak2 = this.getJarak(this.list_pengiriman[iMin].lat,this.list_pengiriman[iMin].lng);
				if ( jarak1 < jarak2 && this.list_pengiriman[i].status_pengiriman != 'SUKSES')
				{
					iMin = i;
				}
			}
			if (iMin != j) 
		    {
		        let temp:ListPengiriman;
		        temp = this.list_pengiriman[j];
		        this.list_pengiriman[j] = this.list_pengiriman[iMin];
		        this.list_pengiriman[iMin] = temp;
		    }
		}

	}
	sortByPrioritas()
	{
		let n = this.list_pengiriman.length;
		for(let j=0; j< n-1; j++)
		{
			let iMin = j;
			for (let i = j+1; i < n; i++)
			{
				let prioritas1 = this.list_pengiriman[i].prioritas;
				let prioritas2 = this.list_pengiriman[iMin].prioritas;
				if ( prioritas1 < prioritas2 && this.list_pengiriman[i].status_pengiriman != 'SUKSES')
				{
					iMin = i;
				}
			}
			if (iMin != j) 
		    {
		        let temp:ListPengiriman;
		        temp = this.list_pengiriman[j];
		        this.list_pengiriman[j] = this.list_pengiriman[iMin];
		        this.list_pengiriman[iMin] = temp;
		    }
		}

	}
	goToDetail(data, IDPengiriman, IDKurir)
	{
		let dataModal = {
			paket_barang : JSON.stringify(data),
			IDPengiriman : IDPengiriman,
			IDKurir : IDKurir
		};
    	let modal = this.modalCtrl.create(PaketBarangPage,dataModal);
	
    	modal.onDidDismiss(data=>{
    		console.log(data);
    		this.list_pengiriman = this.list_pengiriman.map(
    			list=>{
    				if(list.IDPengiriman == data.IDPengiriman)
    				{
    					list.status_pengiriman = data.status_pengiriman;
    					list.keterangan = data.keterangan;
    				}
					return list;
    			})
    	});
    	modal.present();
	}
}
