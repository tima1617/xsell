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
  datelimit: any;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  countdown: any;
  maxtime: any;
  timer: any;
  hidevalue: boolean;

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
        var today = new Date().getTime()/1000;
        this.datelimit = e.payload.doc.get('date_limit').toDate().getTime()/1000
        this.maxtime = (this.datelimit - today)
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
          countdownDay: Math.floor(this.maxtime / (60 * 60 * 24)),
          countdownHour: Math.floor((this.maxtime % (60 * 60 * 24)) / (60 * 60))
        } as Product
      })
    })
  }

  
  StartTimer(){
    this.timer = setTimeout(x => 
      {
          if(this.maxtime <= 0) { }
          this.maxtime -= 1;
          this.days = Math.floor(this.maxtime / (60 * 60 * 24));
          this.hours = Math.floor((this.maxtime % (60 * 60 * 24)) / (60 * 60));
          this.minutes = Math.floor((this.maxtime % (60 * 60)) / (60));
          this.seconds = Math.floor((this.maxtime % (60)));
          this.countdown = this.days + "d " + this.hours + "h " + this.minutes + "m " + this.seconds + "s "
          console.log(this.days + "d " + this.hours + "h " + this.minutes + "m " + this.seconds + "s ")

          if(this.maxtime>0){
            this.hidevalue = false;
            this.StartTimer();
          }
          
          else{
              this.hidevalue = true;
          }

      }, 1000);
 

  }
  

  
}
