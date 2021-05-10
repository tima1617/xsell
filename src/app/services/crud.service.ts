import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';

export class user {
  uid: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})

export class CrudService {

  constructor(
    private ngFirestore: AngularFirestore,
    private router: Router,
    private db: AngularFirestore
  ) { }

  getTasks() {
    return this.ngFirestore.collection('tasks').snapshotChanges();
  }
  
  getTask(id) {
    return this.ngFirestore.collection('tasks').doc(id).valueChanges();
  }

  //update(id, todo: TODO) {
  //  this.ngFirestore.collection('tasks').doc(id).update(todo)
  //    .then(() => {
  //      this.router.navigate(['/todo-list']);
  //    }).catch(error => console.log(error));;
  //}

  delete(id: string) {
    this.ngFirestore.doc('tasks/' + id).delete();
  }

  getUser(userEmail: string):Observable<any>{
    return this.db.collection<any>("users", ref => ref.where('email','==',userEmail)).valueChanges();
  }

  createUser(user){
    return this.db.collection("users").add(user);
  }


}