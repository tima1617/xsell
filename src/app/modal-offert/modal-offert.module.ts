import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalOffertPageRoutingModule } from './modal-offert-routing.module';

import { ModalOffertPage } from './modal-offert.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalOffertPageRoutingModule
  ],
  declarations: [ModalOffertPage]
})
export class ModalOffertPageModule {}
