import { Product } from './../../models/product.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class OffertService {

  constructor(private angularFirestore: AngularFirestore, private db: AngularFirestore) { }

  updateProductWithOffer(offert){
    return this.db
    .collection("products")
    .doc(offert.id_product)
    .update({
        best_offer: offert.best_offer,
        best_offer_user_id: offert.id_user
    });
  }

  createOffer(offert){
    return this.db.collection("offerts").add(offert);
  }
}