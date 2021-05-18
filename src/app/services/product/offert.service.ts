import { Product } from './../../models/product.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class OffertService {

  constructor(private angularFirestore: AngularFirestore) { }

  updateProductWithOffer(offert){
    return this.angularFirestore
    .collection("products")
    .doc(offert.id_product)
    .update({
        best_offer: offert.best_offer,
        best_offer_user_id: offert.id_user
    });
  }

  createOffer(offert){
    return this.angularFirestore.collection("offerts").add(offert);
  }
}