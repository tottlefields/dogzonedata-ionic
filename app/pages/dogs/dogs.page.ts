import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { DogsService } from 'src/app/services/dogs.service';
import { AddDogComponent } from './add-dog/add-dog.component';

@Component({
  selector: 'app-dogs',
  templateUrl: './dogs.page.html',
  styleUrls: ['./dogs.page.scss'],
})
export class DogsPage implements OnInit {

  public dogs: any;
  formData: NgForm;

  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private dogsService: DogsService,
    private router: Router,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.dogs = this.dogsService.getDogs();
  }

  signOut() {
    this.authService.logOut();
  }

  async onShowAddDogModal(){
    this.modalCtrl
      .create({ component: AddDogComponent })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(async (resultData) => {
        this.formData = resultData.data;
        if (resultData.role === 'addDog') {
          const loading = await this.loadingCtrl.create({
            message: 'Adding dog...'
          });

          this.formData.value.dob = new Date(this.formData.value.dateOfBirth);
          // console.log(this.formData.value);

          this.dogsService.addDog(this.formData.value).then(
            () => { loading.dismiss(); },
            error => { console.log(error); }
          );
        }
      });
  }

}
