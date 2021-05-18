import { AuthenticateService } from './../services/authentication.service';
import { ProductService } from './../services/product/product.service';
import { Product } from './../models/product.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.page.html',
  styleUrls: ['./my-products.page.scss'],
})
export class MyProductsPage implements OnInit {
  Products: Product[];
  userId: string;
  noOffert: boolean;

  constructor(private ProductService: ProductService, private authService: AuthenticateService) { }

  ngOnInit() {
   this.authService.userDetails().subscribe(res => {
     this.userId = res.uid;
     this.products(this.userId)
   })     
  }

  products(id) 
  {
    this.ProductService.getProductByUser(id).subscribe(res => {
      if(res.length === 0 ){
        this.noOffert = true;
      }
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
          sold: e.payload.doc.get('sold')
        } as Product
      })
    })
  }
}
