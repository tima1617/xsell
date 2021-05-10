// dashboard.page.ts
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit {

  userEmail: string;
  user:{
    uid: string,
    email: string
  }
  data:any

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private db: AngularFirestore,
  ) {
   }

  
  ngOnInit() {
    //Permet de vérifier si le user est bien connecté, sinon il est renvoyé page login
    this.authService.userDetails().subscribe(res => {
      if (res !== null) {
        this.userEmail = res.email;
        this.getuser(this.userEmail).subscribe((data)=>{
          this.data = data;
          console.log(this.data[0])
          var user = {
            uid: this.data[0].UID,
            email: this.data[0].email
          }
          console.log(user);
      });

      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    });
  }
  
  logout() {
    this.authService.logoutUser()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        console.log(error);
      })
  }

  //Permet de réupérer le user associé à l'adresse email rentrée précèdemment
  getuser(userEmail: string):Observable<any>{
    return this.db.collection<any>("users", ref => ref.where('email','==',this.userEmail)).valueChanges();
  }
}

