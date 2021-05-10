import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticateService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';
import { CrudService } from './../services/crud.service';
import { firebase } from '@firebase/app'

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

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
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
          console.log("ici");
          var userAdd = {
            email: user.email,
            uid: user.uid
          }
          console.log(userAdd);
          this.crudService.createUser(userAdd);
        } else {
        }
        this.errorMessage = "";
        this.successMessage = "Your account has been created. Please log in.";
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      })
  }

  goLoginPage() {
    this.navCtrl.navigateBack('');
  }


}
