import { ProductService } from './../services/product/product.service';
import { Product } from './../models/product.model';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.page.html',
  styleUrls: ['./all-products.page.scss'],
})
export class AllProductsPage implements OnInit {
  Products: Product[];
  url: any;

  constructor(
    private ProductService: ProductService,
    public afSG: AngularFireStorage,
    ) { }

  ngOnInit() {
    this.products();
  }

  products() 
  {
    this.ProductService.getProductList().subscribe(res => {
      this.Products = res.map(e => {
        return {
          id: e.payload.doc.id,
          name: e.payload.doc.get('name'),
          description: e.payload.doc.get('description'),
          price: e.payload.doc.get('price'),
          best_offer_id: e.payload.doc.get('best_offer_id'),
          user_id: e.payload.doc.get('user_id'),
          createTime: e.payload.doc.get('createTime'),
          date_limit: e.payload.doc.get('date_limit'),
          updateTime: e.payload.doc.get('updateTime'),
          ref: e.payload.doc.get('ref'),
          condition: e.payload.doc.get('condition'),
          sold: false
        } as Product
      })
    })
  }
  

  
}
