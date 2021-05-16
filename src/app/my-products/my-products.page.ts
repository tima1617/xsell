import { CrudService } from './../services/crud.service';
import { AuthenticateService } from './../services/authentication.service';
import { ProductService } from './../services/product/product.service';
import { Product } from './../models/product.model';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.page.html',
  styleUrls: ['./my-products.page.scss'],
})
export class MyProductsPage implements OnInit {
  Products: Product[];
  userEmail: string;
  user: any;
  userId: string;
  url: any;

  constructor(private ProductService: ProductService, public afSG: AngularFireStorage, private authService: AuthenticateService, private crudService: CrudService) { }

  ngOnInit() {
    this.authService.userDetails().subscribe(res => {
      this.userEmail = res.email;
      this.crudService.getUser(this.userEmail).subscribe(data => {
        this.user = data.map(e => {
          this.userId = e.payload.doc.id
          this.products(this.userId)
        })
      })      
    });
  }

  products(id) 
  {
    this.ProductService.getProductByUser(id).subscribe(res => {
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
          sold: false,
          test: this.getUrlImages('/product_img/Jordan_VI_UNC.jpg')
        } as Product
      })
    })
  }

  getUrlImages(ref){
    this.afSG.ref('/product_img/Jordan_VI_UNC.jpg').getDownloadURL().subscribe(imgUrl => {
        this.url = imgUrl;
        //console.log(imgUrl)
        return this.url
    });
  }

}
