import { PaketBarang } from '../models/PaketBarang';

export class ListPengiriman{
	IDCabang:number;
	IDKurir:number;
	IDPaket:number;
	IDPengiriman:number;
	created_on:number;
	isSyn:string;
	kategori_paket:string;
	prioritas:number;
	status_pengiriman:string;
	trash:string;
	waktu_mulai:number;
	waktu_selesai:number;
	keterangan:string;
	
	nama_paket:string;
	lat:number;
	lng:number;

}