import { Product } from './../../models/product.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private angularFirestore: AngularFirestore, public afSG: AngularFireStorage) { }

  getProductDoc(id)
  {
    return this.angularFirestore
    .collection('products')
    .doc(id)
    .valueChanges();
  }

  getProductList()
  {
    let test= false;
    return this.angularFirestore
    .collection("products", ref => ref.where('sold','==',test))
    .snapshotChanges();
  }

  getProductByUser(id)
  {
    return this.angularFirestore
    .collection("products", ref => ref.where('user_id','==',id))
    .snapshotChanges();
  }

  getProductBySearch(search)
  {
    return this.angularFirestore
    .collection<Product>('products', ref => { return ref.orderBy('name').startAt(search).endAt(search+'\uf8ff') })
    .snapshotChanges();
  }

  deleteProduct(product) {
    console.log(product.id)
    return this.angularFirestore
      .collection("products")
      .doc(product.id)
      .delete();
  }

  createProduct(product) {
    return this.angularFirestore.collection("products").add(product);
  }
}