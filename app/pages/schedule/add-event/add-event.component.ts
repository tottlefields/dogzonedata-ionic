import { DogPickerComponent } from './../../../shared/pickers/dog-picker/dog-picker.component';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  dogList = [];
  @ViewChild('dogPicker', { static: false }) dogPicker: DogPickerComponent;

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

    const checkboxArrayList: FormArray = this.eventForm.get('dogsList') as FormArray;

    this.dogs.subscribe(data => {
      data.forEach((d: Dog) => {
        let checkedBool = false;
        if (this.dog && this.dog.id == d.id){ 
          checkedBool = true;
          checkboxArrayList.push(new FormControl(d.id));
        }
        this.dogList.push({ id: d.id, name: d.name, checked: checkedBool, cssColor: d.cssColor })
      })
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
