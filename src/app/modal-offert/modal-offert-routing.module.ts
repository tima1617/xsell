import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalOffertPage } from './modal-offert.page';

const routes: Routes = [
  {
    path: '',
    component: ModalOffertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalOffertPageRoutingModule {}
