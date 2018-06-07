import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaketBarangPage } from './paket-barang';
import { PaketBarang } from '../../models/PaketBarang';

@NgModule({
  declarations: [
    PaketBarangPage,
  ],
  imports: [
    IonicPageModule.forChild(PaketBarangPage),
  ],
})
export class PaketBarangPageModule {}
