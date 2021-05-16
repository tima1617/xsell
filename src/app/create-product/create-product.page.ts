// dashboard.page.ts
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CrudService } from './../services/crud.service';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { User } from './../models/user.model';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ProductService } from './../services/product/product.service'

export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.page.html',
  styleUrls: ['./create-product.page.scss'],
})
export class CreateProductPage implements OnInit {

  myForm: FormGroup;
  submitted = false;
  users: User[];
  userEmail: string;
  userId: string;
  userValid: boolean;
  data:any
  birthday: any;
  today: any;
  maxDate: any;
  product: any;
  ref: string;
  imageRef: any;

  
  // File upload task 
  fileUploadTask: AngularFireUploadTask;

  // Upload progress
  percentageVal: Observable<number>;

  // Track file uploading with snapshot
  trackSnapshot: Observable<any>;

  // Uploaded File URL
  UploadedImageURL: Observable<string>;

  // Uploaded image collection
  files: Observable<imgFile[]>;

  // Image specifications
  imgName: string;
  imgSize: number;

  // File uploading status
  isFileUploading: boolean;
  isFileUploaded: boolean;

  private filesCollection: AngularFirestoreCollection<imgFile>;
  
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private db: AngularFirestore,
    private crudService: CrudService,
    public formBuilder: FormBuilder,
    private afStorage: AngularFireStorage,
    public productService : ProductService
  ) {
    this.isFileUploading = false;
    this.isFileUploaded = false;
    
    this.filesCollection = db.collection<imgFile>('imagesCollection');
    this.files = this.filesCollection.valueChanges();
   }

  
  ngOnInit() {
    const now = new Date();
    this.today = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1 )
    this.today = this.formatDate(this.today)
    this.maxDate =  new Date(now.getFullYear() + 1, now.getMonth(), now.getDate() )
    this.maxDate = this.formatDate(this.maxDate)
    
    //Permet de vérifier si le user est bien connecté, sinon il est renvoyé page login
    this.authService.userDetails().subscribe(res => {
      if (res !== null) {
        this.userEmail = res.email;
        this.crudService.getUser(this.userEmail).subscribe(data => {
          this.users = data.map(e => {
            this.userId = e.payload.doc.id,
            this.userValid = e.payload.doc.get('valid')
          })
        });
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
    });

    const currency="(?!(^0+(\.0+)?$))^\d{1,4}(\.\d{1,2})?$"
    //Creation du formulaire
    this.myForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      price: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      dateLimit: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      state: ['', [Validators.required]],
      file:  ['', [Validators.required]]
    })

    

  }
  
  get errorCtr() {
    return this.myForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.myForm.valid) {
      return false;
    } else {

      this.trackSnapshot = this.fileUploadTask.snapshotChanges().pipe(
    
        finalize(() => {
          // Retreive uploaded image storage path
          this.UploadedImageURL = this.imageRef.getDownloadURL();
          let todayDate = Date.now();
    
    
    
          this.UploadedImageURL.subscribe(resp=>{
            this.product = {
              name: this.myForm.value.title,
              price: this.myForm.value.price,
              date_limit: new Date(this.myForm.value.dateLimit),
              description : this.myForm.value.description,
              condition: this.myForm.value.state,
              sold: false,
              ref: resp,
              created_at: todayDate,
              user_id: this.userId
            }
            this.productService.createProduct(this.product);
            this.isFileUploading = false;
            this.isFileUploaded = true;
          },error=>{
          })
        }),
        tap(snap => {
            this.imgSize = snap.totalBytes;
        })
      )
      this.trackSnapshot.subscribe(() => {
    }, (error) => {
    }, () => {
      this.navCtrl.navigateForward('/all-products');
    });
    }
  }



  logout() {
    this.authService.logoutUser()
      .then(res => {
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
      })
  }


  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

uploadImage(event: FileList) {
      
  const file = event.item(0)

  // Image validation
  if (file.type.split('/')[0] !== 'image') { 
    return;
  }

  this.isFileUploading = true;
  this.isFileUploaded = false;

  this.imgName = file.name;

  // Storage path
  const fileStoragePath = `filesStorage/${new Date().getTime()}_${file.name}`;

  // Image reference
  this.imageRef = this.afStorage.ref(fileStoragePath);

  // File upload task
  this.fileUploadTask = this.afStorage.upload(fileStoragePath, file);

  // Show uploading progress
  this.percentageVal = this.fileUploadTask.percentageChanges();
}


storeFilesFirebase(image: imgFile) {
  const fileId = this.db.createId();
  
  this.filesCollection.doc(fileId).set(image).then(res => {
  }).catch(err => {
  });
}

setUpInformation(){
  this.navCtrl.navigateForward('/dashboard');
}


}

