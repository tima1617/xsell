import { ProductService } from './../services/product/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  id = this.act.snapshot.paramMap.get('id');

  constructor(private act: ActivatedRoute,private productService: ProductService,) { }

  ngOnInit() {
    console.log(this.id)
    this.productService.getProductDoc(this.id);
    console.log(this.productService.getProductDoc(this.id))
  }
}
