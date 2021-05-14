import { CrudService } from './../services/crud.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { firebase } from '@firebase/app'
import '@firebase/auth'
import { AuthenticateService } from '../services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = null;
  validations_form: FormGroup;
  errorMessage: string = '';
  data: any;

  constructor(

    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    public fireAuth: AngularFireAuth,
    public crudService: CrudService
    
  ) { 
    this.fireAuth.authState.subscribe((user) => {
      this.user = user ? user : null;
    });
  }

  ngOnInit() {

    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }


  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };


  loginUser(value) {
    this.authService.loginUser(value)
      .then(res => {
        console.log(res);
        console.log(value);
        
        this.errorMessage = "";
        this.navCtrl.navigateForward('/dashboard');

        
      }, err => {
        this.errorMessage = err.message;
      })
  }
  
  loginGoogle() {
    this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
      var user = firebase.auth().currentUser;
        if (user) {
          var userAdd = {
            email: user.email,
            uid: user.uid
          }
          //Permet d'ajouter le user dans la bdd si il n'y est pas
          this.crudService.getUser(userAdd.email).subscribe((data)=>{
            this.data = data;
            if(data.length === 0){
              this.crudService.createUser(userAdd);
            }
        });
        } else {
        }
      this.navCtrl.navigateForward('/dashboard');
    });

  }

  logout() {
    this.fireAuth.signOut();
  }


  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }

}
