import { Component, OnInit } from '@angular/core';
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
    private authService: AuthService,
    private dogsService: DogsService,
    private router: Router,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
    this.dogs = this.authService.dogs;
  }

  doLogout(){
    this.authService.logoutUser();
    this.router.navigateByUrl('/auth');
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
          const name = this.formData.value.name;
          const breed = this.formData.value.breed;
          const color = this.formData.value.color;
          const dob = new Date(this.formData.value.dateOfBirth);
          const sex = this.formData.value.sex;

          const loading = await this.loadingCtrl.create({
            message: 'Adding dog...'
          });

          this.dogsService.createDog(this.authService.currentUser.uid, name, breed, color, dob, sex)
            .then(
              () => {
                loading.dismiss();
              },
              error => {
                console.error(error);
              }
            );
        }
      });

  }

}
