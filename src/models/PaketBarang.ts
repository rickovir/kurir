export class PaketBarang{
	IDPaket:number;
	IDCabang:number;
	nama_paket:string;
	no_resi:string;
	nama_pengirim:string;
	alamat_pengirim:string;
	telepon_pengirim:string;
	nama_penerima:string;
	alamat_penerima:string;
	telepon_penerima:number;
	berat:number;
	kategori_paket:string;
	jenis_paket:string;
	tarif:number;
	created_on:number;

	constructor(){
		this.IDPaket = 0;
		this.IDCabang = 0;
		this.nama_paket = "";
		this.no_resi = "";
		this.nama_pengirim = "";
		this.alamat_pengirim = "";
		this.telepon_pengirim = "";
		this.nama_penerima = "";
		this.alamat_penerima = "";
		this.telepon_penerima = 0;
		this.berat = 0;
		this.kategori_paket = "";
		this.jenis_paket = "";
		this.tarif = 0;
		this.created_on = 0;
	}
}