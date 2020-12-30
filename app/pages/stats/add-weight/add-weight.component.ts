import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DogsService } from 'src/app/services/dogs.service';
import { Dog } from 'src/app/models/dog.interface';

@Component({
  selector: 'app-add-weight',
  templateUrl: './add-weight.component.html',
  styleUrls: ['./add-weight.component.scss'],
})
export class AddWeightComponent implements OnInit {
  public today: string;
  public dogs: any;
  public dogData = [];
  dog: Dog;

  constructor(
    private modalCtrl: ModalController,
    public authService: AuthService,
    private toastCtrl: ToastController,
    private dogsService: DogsService
    ) {
    this.today = new Date().toString();
    this.dogs = this.dogsService.getDogs();
   }

  ngOnInit() {
    // console.log(this.dog);
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async onAddWeight(form: NgForm) {
    this.modalCtrl.dismiss(form, 'addWeight');
    let name = (this.dog) ? this.dog.name : form.value.dog.name;
    const toast = await this.toastCtrl.create({
      message: 'New weight record added for ' + name,
      duration: 2500,
      cssClass: 'ion-text-center'
    });
    toast.present();
  }
}
