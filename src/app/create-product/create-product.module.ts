import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CreateProductPage } from './create-product.page';
import { FormatFileSizePipe } from './../pipe/format-file-size.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CreateProductPage
      }
    ])
  ],
  declarations: [CreateProductPage,FormatFileSizePipe]
})
export class CreateProductPageModule {}
