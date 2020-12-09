import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DogsService } from 'src/app/services/dogs.service';

@Component({
  selector: 'app-add-weight',
  templateUrl: './add-weight.component.html',
  styleUrls: ['./add-weight.component.scss'],
})
export class AddWeightComponent implements OnInit {
  public today: string;
  public dogs: any;
  public dogData = [];

  constructor(
    private modalCtrl: ModalController,
    public authService: AuthService,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    private dogsService: DogsService
    ) {
    this.today = new Date().toString();
    this.dogs = this.dogsService.getDogs();
    // this.dogs = this.navParams.data.dogs;
    // this.dogs.subscribe(result => {
    //   result.forEach(dog => {
    //     this.dogData[dog.id] = dog;
    //   });
    // });
   }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async onAddWeight(form: NgForm) {
    this.modalCtrl.dismiss(form, 'addWeight');
    const toast = await this.toastCtrl.create({
      message: 'New weight record added for ' + form.value.dog.name,
      duration: 2500,
      cssClass: 'ion-text-center'
    });
    toast.present();
  }
}
