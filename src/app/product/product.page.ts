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
  productRef: any;
  name: string;
  description: string;
  price: number;
  condition: string;
  maxtime: any;
  timer: any;
  hidevalue: boolean;
  datelimit: any;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  constructor(private act: ActivatedRoute,private productService: ProductService) { }
  
  ngOnInit() {    
    this.productService.getProductDoc(this.id).subscribe(res => {
      if(res != undefined ){
        this.productRef = res;
        this.name = this.productRef.name;
        this.description = this.productRef.description;
        this.price = this.productRef.price;
        this.condition = this.productRef.condition;
        this.datelimit = this.productRef.date_limit;
        console.log("Aujourd'hui : "+new Date().getTime()/1000)
        console.log("Date max : "+this.datelimit)
        console.log()
        var today = new Date().getTime()/1000;
        this.maxtime = this.datelimit - today
        //console.log(this.timer)
        this.StartTimer();
      }
    })
  }

  StartTimer(){
    this.timer = setTimeout(x => 
      {
          if(this.maxtime <= 0) { }
          this.maxtime -= 1;
          this.days = Math.floor(this.maxtime / (1000 * 60 * 60 * 24));
          this.hours = Math.floor((this.maxtime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          this.minutes = Math.floor((this.maxtime % (1000 * 60 * 60)) / (1000 * 60));
          this.seconds = Math.floor((this.maxtime % (1000 * 60)) / 1000);
          //console.log(this.maxtime)
          //console.log(this.days + "d " + this.hours + "h " + this.minutes + "m " + this.seconds + "s ")

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
