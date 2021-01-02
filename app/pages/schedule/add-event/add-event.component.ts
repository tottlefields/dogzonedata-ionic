import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Dog } from 'src/app/models/dog.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DogsService } from 'src/app/services/dogs.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {
  public today: Date;
  public dogs: any;
  dog: Dog;
  eventForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    public authService: AuthService,
    private toastCtrl: ToastController,
    private dogsService: DogsService
  ) { 
    this.today = new Date(); //.toString();
    this.dogs = this.dogsService.getDogs();
  }

  ngOnInit() {

    this.eventForm = new FormGroup({
      title: new FormControl('', { updateOn: 'blur' }),
      date: new FormControl(this.today.toISOString(), { updateOn: 'blur', validators: [Validators.required] }),
      dogsList: new FormArray([])
    });
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async onAddEvent() {
    this.modalCtrl.dismiss(this.eventForm, 'addEvent');
    /* let name = (this.dog) ? this.dog.name : form.value.dog.name;
    const toast = await this.toastCtrl.create({
      message: 'New weight record added for ' + name,
      duration: 2500,
      cssClass: 'ion-text-center'
    });
    toast.present(); */
  }

}
