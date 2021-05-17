import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-offert',
  templateUrl: './modal-offert.page.html',
  styleUrls: ['./modal-offert.page.scss'],
})
export class ModalOffertPage implements OnInit {

  @Input() firstName: string;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
