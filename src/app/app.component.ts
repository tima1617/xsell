import { NavController } from '@ionic/angular';
import { AuthenticateService } from './services/authentication.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private AuthenticateService: AuthenticateService, public navCtrl: NavController) {}

  logout() {
    this.AuthenticateService.logoutUser()
      .then(res => {
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        throw new Error(error)
      })
  }
}

