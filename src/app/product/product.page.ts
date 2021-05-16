import { AuthenticateService } from './../services/authentication.service';
import { User } from './../models/user.model';
import { CrudService } from './../services/crud.service';
import { ProductService } from './../services/product/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  id = this.act.snapshot.paramMap.get('id');
  actualUserId: string;
  productRef: any;
  name: string;
  description: string;
  price: number;
  condition: string;
  userId: string;
  maxtime: any;
  timer: any;
  hidevalue: boolean;
  datelimit: any;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  constructor(
    private act: ActivatedRoute,
    private productService: ProductService, 
    private navCtrl: NavController, 
    private CrudService: CrudService,
    private AuthenticateService: AuthenticateService
    ) { }
  
  ngOnInit() {    
    this.productService.getProductDoc(this.id).subscribe(res => {
      if(res != undefined ){
        this.productRef = res;
        this.name = this.productRef.name;
        this.description = this.productRef.description;
        this.price = this.productRef.price;
        this.condition = this.productRef.condition;
        this.datelimit = this.productRef.date_limit;
        this.userId = this.productRef.user_id;
        var today = new Date().getTime()/1000;
        this.maxtime = this.datelimit - today

        this.StartTimer();
        
        this.AuthenticateService.userDetails().subscribe(res => {
          this.actualUserId = res.uid    
        })
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

  getUserId()
  {
    this.AuthenticateService.userDetails().subscribe(res => {
      this.actualUserId = res.uid    
    })
  }

  deleteProduct(product)
  {
    this.productService.createProduct(product);
    this.navCtrl.navigateForward('/my-products');
  }
}
