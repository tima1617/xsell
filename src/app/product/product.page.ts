import { ModalOffertPage } from './../modal-offert/modal-offert.page';
import { ModalController } from '@ionic/angular';
import { ProductService } from './../services/product/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticateService } from './../services/authentication.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OffertService } from './../services/product/offert.service';
import { CrudService } from './../services/crud.service';
import { User } from '../models/user.model';
import firebase from 'firebase/app';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  id = this.act.snapshot.paramMap.get('id');
  actualUserId: string;
  displayOffert: boolean = false;
  userId: string;
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
  countdown: any;
  myForm: FormGroup;
  submitted = false;
  bestoffer: number;
  userEmail: string;
  users: User[];
  id_user: string;
  best_offer_user_id: string;
  userValid: boolean;

  constructor(    
    private act: ActivatedRoute,
    private productService: ProductService, 
    private navCtrl: NavController, 
    private AuthenticateService: AuthenticateService,
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    public offertService: OffertService,
    public crudService: CrudService,
    private authService: AuthenticateService) { }
  
  ngOnInit() {    
    this.authService.userDetails().subscribe(res => {
      if (res !== null) {
        this.userEmail = res.email;
        this.crudService.getUser(this.userEmail).subscribe(data => {
          this.users = data.map(e => {
            this.userValid = e.payload.doc.get('valid');
          })
        });
      } else {
        
      }
    }, err => {
    });

    this.productService.getProductDoc(this.id).subscribe(res => {
      if(res != undefined ){
        this.productRef = res;
        this.name = this.productRef.name;
        this.description = this.productRef.description;
        this.price = this.productRef.price;
        this.condition = this.productRef.condition;
        this.userId = this.productRef.user_id;
        this.datelimit = this.productRef.date_limit;
        var today = new Date().getTime()/1000;
        this.datelimit = this.datelimit.toDate().getTime()/1000;
        this.maxtime = this.datelimit - today;
        this.bestoffer = this.productRef.best_offer;
        this.best_offer_user_id = this.productRef.best_offer_user_id;


        this.myForm = this.formBuilder.group({
          offert: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.min(Number(this.bestoffer)+1)]],
        })

      }
    });

    this.StartTimer();
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

          if(this.maxtime>0){
            this.hidevalue = false;
            this.StartTimer();
          } 
          else{
              this.hidevalue = true;
          }
      }, 1000);
  }

  deleteProduct()
  {
    this.productService.deleteProduct(this.id);
    this.navCtrl.navigateForward('/all-products');
  }

  toggleOffert()
  {
    this.displayOffert = !this.displayOffert;
  }

  get errorCtr() {
    return this.myForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.myForm.valid) {
      return false;
    } else {
      let test = this.myForm.value.offert
          this.crudService.getUser(this.userEmail).subscribe(data => {
            this.users = data.map(e => {
              this.id_user = e.payload.doc.get('uid');
              let offert = {
                best_offer: test,
                date: new Date(),
                id_product: this.id,
                id_user: this.id_user,
              }
              this.offertService.createOffer(offert);
              this.offertService.updateProductWithOffer(offert);
              this.toggleOffert();
            })
          });
        } 
    }
  }