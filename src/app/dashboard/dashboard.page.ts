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
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  
})

export class DashboardPage implements OnInit {

  myForm: FormGroup;
  submitted = false;
  users: User[];
  paramName = "";
  paramEmail = "";
  paramDob;
  paramPhone = "";
  paramAddressLine = "";
  paramCity = "";
  paramState = "";
  paramZip = "";
  paramId = "";
  paramValid = false;
  userEmail: string;
  user:{
    uid: string,
    email: string
  }
  data:any
  birthday: any;
   

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private db: AngularFirestore,
    private crudService: CrudService,
    public formBuilder: FormBuilder,
    private fireAuth: AngularFireAuth
  ) {
   }

  
  ngOnInit() {
    const now = new Date();
    this.birthday = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
    this.birthday = this.formatDate(this.birthday)
    //Permet de vérifier si le user est bien connecté, sinon il est renvoyé page login
    this.authService.userDetails().subscribe(res => {
      if (res !== null) {
        this.userEmail = res.email;
        this.crudService.getUser(this.userEmail).subscribe(data => {
          this.users = data.map(e => {
            this.paramId = e.payload.doc.id;
            this.paramName = e.payload.doc.get('name'),
            this.paramEmail = e.payload.doc.get('email');
            this.paramPhone = e.payload.doc.get('phone');
            this.paramAddressLine = e.payload.doc.get('address_line');
            this.paramCity = e.payload.doc.get('city');
            this.paramState = e.payload.doc.get('state');
            this.paramZip = e.payload.doc.get('zip');
            this.paramValid = e.payload.doc.get('valid');
          })
        });
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
    });

    //Creation du formulaire
    this.myForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z_ ]*$')]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      addressLine: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required]]

    })

    

  }
  
  get errorCtr() {
    return this.myForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.myForm.valid) {
      return false;
    } else {
      let id = this.paramId;
      let user = {
        name: this.myForm.value.name,
        email: this.myForm.value.email,
        phone : this.myForm.value.phone,
        address_line: this.myForm.value.addressLine,
        city: this.myForm.value.city,
        state: this.myForm.value.state,
        zip: this.myForm.value.zip,
        valid: true
      }
      this.crudService.updateUser(user,id);
      this.navCtrl.navigateForward('/all-products');
    }
  }


  logout() {
    this.fireAuth.signOut().then(() => {
      this.navCtrl.navigateForward('/login');
    });
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

