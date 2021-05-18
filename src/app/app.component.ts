import { NavController } from '@ionic/angular';
import { AuthenticateService } from './services/authentication.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private AuthenticateService: AuthenticateService, public navCtrl: NavController, private router: Router) {}

  logout() {
    this.AuthenticateService.logoutUser()
      .then(res => {
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        throw new Error(error)
      })
  }

  hasRoute()
  {
    if(this.router.url == '/login' || this.router.url == '/register'){
      return true;
    } else {
      return false;
    }
  }
}