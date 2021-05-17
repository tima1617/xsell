import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticateService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';
import { CrudService } from './../services/crud.service';
import { firebase } from '@firebase/app'
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  userAdd:{
    uid: string,
    email: string
  }
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };
  data: any;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    public fireAuth: AngularFireAuth,
    private crudService: CrudService
  ) { }

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

  tryRegister(value) {
    this.authService.registerUser(value)
      .then(res => {
        var user = firebase.auth().currentUser;
        if (user) {
          var userAdd = {
            email: user.email,
            uid: user.uid,
            role: 0,
            valid: false
          }
          this.crudService.createUser(userAdd);
        } else {
        }
        this.errorMessage = "";
        this.successMessage = "Your account has been created. Please log in.";
      }, err => {
        this.errorMessage = err.message;
        this.successMessage = "";
      })
  }

  loginGoogle() {
    this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
      var user = firebase.auth().currentUser;
        if (user) {
          var userAdd = {
            email: user.email,
            uid: user.uid,
            role: 0,
            valid: false
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

  goLoginPage() {
    this.navCtrl.navigateBack('');
  }


}
