// dashboard.page.ts
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CrudService } from './../services/crud.service';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { User } from './../models/user.model';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.page.html',
  styleUrls: ['./create-product.page.scss'],
})
export class CreateProductPage implements OnInit {

  myForm: FormGroup;
  submitted = false;
  users: User[];
  userEmail: string;
  user:{
    uid: string,
    email: string
  }
  data:any
  birthday: any;
  today: any;
  maxDate: any;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private db: AngularFirestore,
    private crudService: CrudService,
    public formBuilder: FormBuilder
  ) {
   }

  
  ngOnInit() {
    const now = new Date();
    this.today = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1 )
    this.today = this.formatDate(this.today)
    this.maxDate =  new Date(now.getFullYear() + 1, now.getMonth(), now.getDate() )
    this.maxDate = this.formatDate(this.maxDate)
    
    //Permet de vérifier si le user est bien connecté, sinon il est renvoyé page login
    this.authService.userDetails().subscribe(res => {
      if (res !== null) {
        this.userEmail = res.email;
        this.crudService.getUser(this.userEmail).subscribe(data => {
          this.users = data.map(e => {
          })
        });
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    });

    const currency="(?!(^0+(\.0+)?$))^\d{1,4}(\.\d{1,2})?$"
    //Creation du formulaire
    this.myForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      price: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      dateLimit: ['', [Validators.required]],
      description: ['', [Validators.required]],
      state: ['', [Validators.required]]
    })

    

  }
  
  get errorCtr() {
    return this.myForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log("Formulaire : ")
    console.log(this.myForm.value)
    console.log(this.myForm.valid)
    if (!this.myForm.valid) {
      return false;
    } else {
      //console.log(new Date(this.myForm.value.dob))
      //let user = {
      //  title: this.myForm.value.name,
      //  email: this.myForm.value.email,
      //  dob: new Date(this.myForm.value.dob),
      //  phone : this.myForm.value.phone,
      //  address_line: this.myForm.value.addressLine,
      //  city: this.myForm.value.city,
      //  state: this.myForm.value.state,
      //  zip: this.myForm.value.zip,
      //  valid: true
      //}
      //this.crudService.updateUser(user,id);
      this.navCtrl.navigateForward('/all-products');
    }
  }



  logout() {
    this.authService.logoutUser()
      .then(res => {
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
      })
  }


  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}



}

